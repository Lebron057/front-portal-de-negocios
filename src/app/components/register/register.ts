import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarVoltar } from '../navbar-voltar/navbar-voltar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarVoltar, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  tipoCadastro: 'empresa' | 'consumidor' = 'empresa';

  consumidorModel = {
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  };

  empresaModel = {
    cnpj: '',
    nomeEmpresa: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
  };

  isSuccessVisible = false;
  successMessage = '';
  emailPattern = emailRegex;
  mensagemErro = '';
  carregando = false;
  showPassword = false;
  showConfirmarSenha = false;

  constructor(private router: Router, private authService: AuthService) {}

  alternarTipo() {
    this.isSuccessVisible = false;
    this.mensagemErro = '';
    if (this.tipoCadastro === 'consumidor') {
      this.tipoCadastro = 'empresa';
      this.resetFormConsumidor();
    } else {
      this.tipoCadastro = 'consumidor';
      this.resetFormEmpresa();
    }
  }

  cadastrarConsumidor() {
    if (!this.verificarSenhas('consumidor')) {
      this.mensagemErro = 'As senhas não conferem.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';
    this.authService
      .registrarConsumidor({
        nome: this.consumidorModel.nome,
        email: this.consumidorModel.email,
        telefone: this.consumidorModel.telefone,
        senha: this.consumidorModel.senha,
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Cadastro realizado com sucesso!';
          this.isSuccessVisible = true;
          this.authService.login(this.consumidorModel.email, this.consumidorModel.senha, 'usuario').subscribe({
            next: () => this.router.navigate(['/usuario']),
            error: () => this.router.navigate(['/login']),
          });
          this.resetFormConsumidor();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar consumidor', erro);
          this.mensagemErro = 'Não foi possível concluir o cadastro.';
        },
        complete: () => (this.carregando = false),
      });
  }

  cadastrarEmpresa() {
    if (!this.verificarSenhas('empresa')) {
      this.mensagemErro = 'As senhas não conferem.';
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.authService
      .registrarEmpresa({
        nome: this.empresaModel.nomeEmpresa,
        email: this.empresaModel.email,
        telefone: this.empresaModel.telefone,
        senha: this.empresaModel.senha,
      })
      .subscribe({
        next: () => {
          const draft = {
            nomeResponsavel: this.empresaModel.nomeEmpresa,
            email: this.empresaModel.email,
            cnpj: this.empresaModel.cnpj,
            nomeEmpresa: this.empresaModel.nomeEmpresa,
            senha: this.empresaModel.senha,
            telefone: this.empresaModel.telefone,
          };
          localStorage.setItem('empresaRegistro', JSON.stringify(draft));

          this.authService.login(this.empresaModel.email, this.empresaModel.senha, 'empresa').subscribe({
            next: () => this.router.navigate(['/register-detalhes-empresa']),
            error: () => {
              this.mensagemErro = 'Não foi possível autenticar. Escolha o tipo de acesso e tente novamente.';
            },
          });
          this.successMessage = 'Cadastro realizado! Complete os detalhes do negócio.';
          this.isSuccessVisible = true;
          this.resetFormEmpresa();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar empresa', erro);
          this.mensagemErro = 'Não foi possível concluir o cadastro da empresa.';
        },
        complete: () => (this.carregando = false),
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmarSenhaVisibility() {
    this.showConfirmarSenha = !this.showConfirmarSenha;
  }

  verificarSenhas(tipo: 'consumidor' | 'empresa'): boolean {
    if (tipo === 'consumidor') {
      return this.consumidorModel.senha === this.consumidorModel.confirmarSenha;
    } else {
      return this.empresaModel.senha === this.empresaModel.confirmarSenha;
    }
  }

  formatarTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    this.consumidorModel.telefone = value;
    this.empresaModel.telefone = value;
  }

  formatarCNPJ(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    this.empresaModel.cnpj = value;
  }

  private resetFormConsumidor() {
    this.consumidorModel = { nome: '', email: '', telefone: '', senha: '', confirmarSenha: '' };
  }

  private resetFormEmpresa() {
    this.empresaModel = { cnpj: '', nomeEmpresa: '', email: '', telefone: '', senha: '', confirmarSenha: '' };
  }
}
