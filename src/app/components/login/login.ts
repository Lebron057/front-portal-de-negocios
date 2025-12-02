import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, Router } from "@angular/router";
import { NavbarVoltar } from "../navbar-voltar/navbar-voltar";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NavbarVoltar
],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  // Controla qual formulário é exibido
  tipoLogin: 'empresa' | 'consumidor' = 'empresa';

  // Modelo de dados para o formulário de consumidor
  consumidorModel = {
    emailTelefone: '',
    senha: ''
  };

  // Modelo de dados para o formulário de empresa
  empresaModel = {
    cnpjEmail: '',
    senha: ''
  };


  // Controle de visibilidade e mensagem de sucesso
  isSuccessVisible = false;
  successMessage = '';
  emailPattern = emailRegex;


  constructor(private router: Router) { }

  /**
   * Alterna entre os formulários de consumidor e empresa.
   */
  alternarTipo() {
    // Esconde a mensagem de sucesso ao trocar
    this.isSuccessVisible = false;

    if (this.tipoLogin === 'consumidor') {
      this.tipoLogin = 'empresa';
      this.resetFormConsumidor();
    } else {
      this.tipoLogin = 'consumidor';
      this.resetFormEmpresa();
    }
  }

  /**
   * Chamado pelo (ngSubmit) do formulário de consumidor.
   */
  loginConsumidor() {
    // Simula chamada à API
    console.log('📤 POST /api/consumidores/login');
    console.log('📊 Dados enviados:', {
      emailTelefone: this.consumidorModel.emailTelefone,
      senha: '******'
    });
    console.log('🔎 Verificando em TB_CONSUMIDORES...');

    // Exibe mensagem
    this.mostrarSucesso(`✅ Login de consumidor realizado com sucesso!`);

    // Reseta o formulário
    this.resetFormConsumidor();

    // Redireciona para a home
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000); // Pequeno delay para ver a mensagem de sucesso
  }

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Chamado pelo (ngSubmit) do formulário de empresa.
   */
  loginEmpresa() {
    // Simula chamada à API
    console.log('📤 POST /api/empresas/login');
    console.log('📊 Dados enviados:', {
      cnpjEmail: this.empresaModel.cnpjEmail,
      senha: '******'
    });
    console.log('🔎 Verificando em TB_EMPRESAS...');

    // Exibe mensagem
    this.mostrarSucesso(`✅ Login de empresa realizado com sucesso!`);

    // Reseta o formulário
    this.resetFormEmpresa();

    // Redireciona para a home
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000); // Pequeno delay para ver a mensagem de sucesso
  }

  // --- Funções Auxiliares --

  private mostrarSucesso(mensagem: string) {
    this.successMessage = mensagem;
    this.isSuccessVisible = true;

    // Esconde mensagem após 5 segundos
    setTimeout(() => {
      this.isSuccessVisible = false;
    }, 5000);
  }

  private resetFormConsumidor() {
    this.consumidorModel = {
      emailTelefone: '', senha: ''
    };
  }

  private resetFormEmpresa() {
    this.empresaModel = {
      cnpjEmail: '', senha: ''
    };
  }
}