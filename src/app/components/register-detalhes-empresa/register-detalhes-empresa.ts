import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarVoltar } from "../navbar-voltar/navbar-voltar";


@Component({
    selector: 'app-register-detalhes-empresa',
    imports: [CommonModule, NavbarVoltar, FormsModule],
    templateUrl: './register-detalhes-empresa.html',
    styleUrl: './register-detalhes-empresa.css',
})
export class RegisterDetalhesEmpresa {
    // Variável para controlar a exibição do modal de sucesso
    cadastroSucesso: boolean = false;

    // Variável para armazenar a mensagem de erro, se houver
    mensagemErro: string = '';

    // 2. Injetar o Router no construtor
    constructor(private router: Router) { }

    /**
     * Método simulado para realizar um cadastro.
     * Na vida real, esta função faria uma chamada a um serviço (API).
     */
    realizarCadastro(): void {
        // 1. Resetar estados anteriores
        this.cadastroSucesso = false;
        this.mensagemErro = '';

        // 2. Simulação da lógica de cadastro (Ex: chamada a API)
        const sucesso = Math.random() > 0.3; // 70% de chance de sucesso para o exemplo

        if (sucesso) {
            // 3. IF: Cadastro bem-sucedido
            this.cadastroSucesso = true;

            // Opcional: Fechar o modal e REDIRECIONAR automaticamente após alguns segundos
            setTimeout(() => {
                this.fecharModal();

                // 3. Comando de redirecionamento para a página inicial (raiz '/')
                this.router.navigate(['/login']);

            }, 2000); // Redireciona 3 segundos após o sucesso.

        } else {
            // 4. ELSE: Cadastro falhou
            this.mensagemErro = 'Não foi possível salvar as alterações. Complete todos os campos ou garanta que nada esteja errado.';
        }
    }

    /**
     * Método para fechar o modal.
     */
    fecharModal(): void {
        this.cadastroSucesso = false;
        this.mensagemErro = '';
    }

    detalhesEmpresa = {
        cep: '',
        endereco: '',
        contato: '',
        descricao: '',
        imagens: '',
        horaAbertura: '',
        horaFechamento: '',
    }

    formatarCep(cep: string): string {
        return cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
    }

    formatarContato(event: any) {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        }
        // Atualiza o valor no modelo e no input
        this.detalhesEmpresa.contato = value;
    }

    arquivosSelecionados: File[] = [];

    get nomesArquivos(): string[] {
        return this.arquivosSelecionados.map(file => file.name);
    }

    onFileSelected(event: any): void {
        const files: FileList = event.target.files;
        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                this.arquivosSelecionados.push(files[i]);
            }
        }
        // Limpa o input para permitir selecionar o mesmo arquivo novamente se desejar
        event.target.value = '';
    }

    removerArquivo(index: number, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.arquivosSelecionados.splice(index, 1);
    }

}


