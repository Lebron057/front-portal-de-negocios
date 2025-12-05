import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { AvaliacaoService, AvaliacaoApi } from '../../services/avaliacao.service';
import { NegocioApiService } from '../../services/negocio.service';
import { forkJoin, of } from 'rxjs';

type StatusComentario = 'Publicado' | 'Pendente' | 'Respondido';

interface Comentario {
  id: number;
  empresa: string;
  titulo: string;
  texto: string;
  data: string;
  status: StatusComentario;
  nota: number;
  tags: string[];
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
})
export class Usuario implements OnInit {
  usuario = {
    nome: 'Carregando...',
    cidade: 'Cidade não informada',
    desde: '—',
    totalComentarios: 0,
    mediaNotas: 0,
    visitas: 0,
    email: '',
    telefone: '',
  };

  comentarios: Comentario[] = [];
  carregando = true;
  erro = '';

  ratingScale = [1, 2, 3, 4, 5];

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private avaliacaoService: AvaliacaoService,
    private negocioService: NegocioApiService,
  ) { }

  ngOnInit(): void {
    const perfil = this.authService.obterPerfilDoToken() || this.authService.obterPerfil();
    if (perfil === 'empresa') {
      this.erro = 'Apenas contas de usuário podem acessar esta área.';
      this.carregando = false;
      return;
    }

    const usuarioId = this.authService.obterUsuarioId();
    if (!usuarioId) {
      this.erro = 'Faça login novamente para carregar seus dados.';
      this.carregando = false;
      return;
    }

    this.carregarUsuario(usuarioId);
    this.carregarAvaliacoes(usuarioId);
  }

  private carregarUsuario(usuarioId: number) {
    this.usuarioService.obterUsuario(usuarioId).subscribe({
      next: (usuario) => {
        this.usuario.nome = usuario.nome || 'Usuário';
        this.usuario.email = usuario.email || '';
        this.usuario.telefone = usuario.telefone || '';
      },
      error: (erro) => {
        console.error('Erro ao carregar usuário', erro);
        this.erro = 'Não foi possível carregar seus dados.';
      },
    });
  }

  private carregarAvaliacoes(usuarioId: number) {
    this.avaliacaoService.listarPorUsuario(usuarioId).subscribe({
      next: (avaliacoes) => this.montarComentarios(avaliacoes),
      error: (erro) => {
        console.error('Erro ao carregar avaliações', erro);
        this.erro = 'Não foi possível carregar seus comentários.';
        this.carregando = false;
      },
    });
  }

  private montarComentarios(avaliacoes: AvaliacaoApi[]) {
    if (!avaliacoes.length) {
      this.comentarios = [];
      this.usuario.totalComentarios = 0;
      this.usuario.mediaNotas = 0;
      this.usuario.visitas = 0;
      this.carregando = false;
      return;
    }

    const negocioIds = Array.from(new Set(avaliacoes.map((a) => a.negocio_id)));
    const negociosMap = new Map<number, string>();

    const requests = negocioIds.map((id) =>
      this.negocioService.obterNegocio(id)
    );

    forkJoin(requests.length ? requests : [of(null)]).subscribe({
      next: (negocios) => {
        negocios.forEach((negocio: any, index) => {
          const id = negocioIds[index];
          if (!id) return;
          negociosMap.set(id, negocio?.nome_estabelecimento || 'Negócio');
        });

        this.comentarios = avaliacoes.map((a) => ({
          id: a.id,
          empresa: negociosMap.get(a.negocio_id) || 'Negócio',
          titulo: a.titulo || 'Sem título',
          texto: a.comentario || '',
          data: this.formatarData(a.data),
          status: 'Publicado',
          nota: a.nota || 0,
          tags: ['Atribuído a você'],
        }));

        this.usuario.totalComentarios = this.comentarios.length;
        this.usuario.mediaNotas = Number(
          (this.comentarios.reduce((acc, c) => acc + (c.nota || 0), 0) / this.comentarios.length).toFixed(1)
        );
        this.usuario.visitas = negocioIds.length;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar negócios', erro);
        this.carregando = false;
      },
    });
  }

  private formatarData(dataIso: string): string {
    const data = new Date(dataIso);
    if (Number.isNaN(data.getTime())) return dataIso;
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  get iniciais(): string {
    return this.usuario.nome
      .split(' ')
      .filter((parte) => !!parte)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase();
  }

  get primeiroNome(): string {
    const [primeiro] = this.usuario.nome.split(' ').filter((parte) => !!parte);
    return primeiro || this.usuario.nome;
  }
}
