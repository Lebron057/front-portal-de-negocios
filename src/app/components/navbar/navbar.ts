import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { NegocioApiService } from '../../services/negocio.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  @Input() actionLabel = 'Entrar';
  @Input() actionLink: string | any[] = '/login';
  @Input() usuarioNome = '';

  loggedIn = false;
  displayName = '';
  painelLink: string | any[] | null = null;
  painelLabel = '';

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private negocioService: NegocioApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const token = this.authService.obterToken();
    if (!token) {
      this.loggedIn = false;
      return;
    }
    this.loggedIn = true;
    this.actionLabel = 'Sair';
    this.actionLink = '/';
    this.displayName = this.usuarioNome || 'Usuário';

    const perfil = this.authService.obterPerfilDoToken() || this.authService.obterPerfil();
    const usuarioId = this.authService.obterUsuarioId();
    const negocioId = this.authService.obterNegocioId();

    if (perfil === 'empresa') {
      this.painelLink = '/comerciante';
      this.painelLabel = 'Painel do comerciante';

      if (negocioId) {
        this.negocioService.obterNegocio(negocioId).subscribe({
          next: (n) => {
            this.displayName = n.nome_estabelecimento || n.nome_dono || this.displayName || 'Empresa';
          },
          error: () => {
            // fallback silencioso
          },
        });
      } else if (usuarioId) {
        // sem negocioId no token: usa dados do usuário para saudar
        this.usuarioService.obterUsuario(usuarioId).subscribe({
          next: (u) => {
            this.displayName = u.nome || this.displayName;
          },
          error: () => {},
        });
      }
    } else if (usuarioId) {
      this.painelLink = '/usuario';
      this.painelLabel = 'Minha conta';
      this.usuarioService.obterUsuario(usuarioId).subscribe({
        next: (u) => {
          this.displayName = u.nome || this.displayName;
        },
        error: () => {
          // silencioso: mantém fallback
        },
      });
    }
  }

  onActionClick(event: Event) {
    if (this.loggedIn) {
      event.preventDefault();
      this.authService.limparSessao();
      this.loggedIn = false;
      this.displayName = '';
      this.router.navigate(['/login']);
    }
  }

  irParaPainel(): void {
    if (this.painelLink) {
      this.router.navigate(Array.isArray(this.painelLink) ? this.painelLink : [this.painelLink]);
    }
  }
}
