import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { NavbarVoltar } from '../navbar-voltar/navbar-voltar';
import { AuthService } from '../../services/auth.service';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NavbarVoltar, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  tipoLogin: 'empresa' | 'consumidor' = 'empresa';

  consumidorModel = {
    emailTelefone: '',
    senha: '',
  };

  empresaModel = {
    cnpjEmail: '',
    senha: '',
  };

  isSuccessVisible = false;
  successMessage = '';
  emailPattern = emailRegex;
  mensagemErro = '';
  carregando = false;
  showPassword = false;

  constructor(private router: Router, private authService: AuthService) {}

  alternarTipo() {
    this.isSuccessVisible = false;
    this.mensagemErro = '';
    if (this.tipoLogin === 'consumidor') {
      this.tipoLogin = 'empresa';
      this.resetFormConsumidor();
    } else {
      this.tipoLogin = 'consumidor';
      this.resetFormEmpresa();
    }
  }

  loginConsumidor() {
    if (!this.consumidorModel.emailTelefone || !this.consumidorModel.senha) {
      this.mensagemErro = 'Preencha e-mail e senha.';
      return;
    }
    this.autenticar(this.consumidorModel.emailTelefone, this.consumidorModel.senha, 'usuario');
  }

  loginEmpresa() {
    if (!this.empresaModel.cnpjEmail || !this.empresaModel.senha) {
      this.mensagemErro = 'Preencha e-mail/CNPJ e senha.';
      return;
    }
    this.autenticar(this.empresaModel.cnpjEmail, this.empresaModel.senha, 'empresa');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private autenticar(usuario: string, senha: string, perfil: 'usuario' | 'empresa') {
    this.carregando = true;
    this.mensagemErro = '';
    this.authService.login(usuario, senha, perfil).subscribe({
      next: () => {
        this.isSuccessVisible = true;
        this.successMessage = 'Login realizado com sucesso!';
        const destino = perfil === 'empresa' ? '/comerciante' : '/usuario';
        setTimeout(() => this.router.navigate([destino]), 300);
      },
      error: (erro) => {
        console.error('Erro no login', erro);
        this.mensagemErro = 'Não foi possível entrar. Verifique as credenciais.';
      },
      complete: () => {
        this.carregando = false;
      },
    });
  }

  private resetFormConsumidor() {
    this.consumidorModel = { emailTelefone: '', senha: '' };
  }

  private resetFormEmpresa() {
    this.empresaModel = { cnpjEmail: '', senha: '' };
  }
}
