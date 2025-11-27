import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarVoltar } from '../navbar-voltar/navbar-voltar';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarVoltar,
    RouterLink
],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {

  // Controla qual formulário é exibido
  tipoCadastro: 'empresa' | 'consumidor' = 'empresa';

  // Modelo de dados para o formulário de consumidor
  consumidorModel = {
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  };

  // Modelo de dados para o formulário de empresa
  empresaModel = {
    cnpj: '',
    nomeEmpresa: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  // Controle de visibilidade e mensagem de sucesso
  isSuccessVisible = false;
  successMessage = '';

  constructor() { }

  /**
   * Alterna entre os formulários de consumidor e empresa.
   */
  alternarTipo() {
    // Esconde a mensagem de sucesso ao trocar
    this.isSuccessVisible = false;

    if (this.tipoCadastro === 'consumidor') {
      this.tipoCadastro = 'empresa';
      this.resetFormConsumidor();
    } else {
      this.tipoCadastro = 'consumidor';
      this.resetFormEmpresa();
    }
  }

  /**
   * Chamado pelo (ngSubmit) do formulário de consumidor.
   */
  cadastrarConsumidor() {
    // Simula chamada à API
    console.log('📤 POST /api/consumidores');
    console.log('📊 Dados enviados:', {
      nome: this.consumidorModel.nome,
      email: this.consumidorModel.email,
      telefone: this.consumidorModel.telefone,
      senha: '******'
    });
    console.log('💾 Salvando em TB_CONSUMIDORES...');

    // Exibe mensagem
    this.mostrarSucesso(`✅ Consumidor "${this.consumidorModel.nome}" cadastrado com sucesso!`);

    // Reseta o formulário
    this.resetFormConsumidor();
  }

  /**
   * Chamado pelo (ngSubmit) do formulário de empresa.
   */
  cadastrarEmpresa() {
    // Simula chamada à API
    console.log('📤 POST /api/empresas');
    console.log('📊 Dados enviados:', {
      cnpj: this.empresaModel.cnpj,
      nomeEmpresa: this.empresaModel.nomeEmpresa,
      email: this.empresaModel.email,
      senha: '******'
    });
    console.log('💾 Salvando em TB_EMPRESAS...');

    // Exibe mensagem
    this.mostrarSucesso(`✅ Empresa "${this.empresaModel.nomeEmpresa}" cadastrada com sucesso!`);

    // Reseta o formulário
    this.resetFormEmpresa();
  }

  // --- Funções Auxiliares ---

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
      nome: '', email: '', telefone: '', senha: '', confirmarSenha: ''
    };
  }

  private resetFormEmpresa() {
    this.empresaModel = {
      cnpj: '', nomeEmpresa: '', email: '', senha: '', confirmarSenha: ''
    };
  }

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // --- Funções de Máscara (para (input) event) ---

  formatarTelefone(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    // Atualiza o valor no modelo e no input
    this.consumidorModel.telefone = value;
  }

  formatarCNPJ(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2');
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    // Atualiza o valor no modelo e no input
    this.empresaModel.cnpj = value;
  }
}