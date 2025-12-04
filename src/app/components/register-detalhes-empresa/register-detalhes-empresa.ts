import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin, of, Observable } from 'rxjs';
import { NavbarVoltar } from "../navbar-voltar/navbar-voltar";
import { NegocioApiService } from '../../services/negocio.service';
import { AuthService } from '../../services/auth.service';

interface EmpresaDraft {
  nomeResponsavel: string;
  email: string;
  cnpj: string;
  nomeEmpresa: string;
  senha: string;
  telefone: string;
}

interface HorarioForm {
  dia: string;
  abre: string;
  fecha: string;
  atende: boolean;
}

@Component({
  selector: 'app-register-detalhes-empresa',
  standalone: true,
  imports: [CommonModule, NavbarVoltar, FormsModule],
  templateUrl: './register-detalhes-empresa.html',
  styleUrl: './register-detalhes-empresa.css',
})
export class RegisterDetalhesEmpresa implements OnInit {
  cadastroSucesso = false;
  mensagemErro = '';
  carregando = false;

  detalhesEmpresa = {
    nomeResponsavel: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    contato: '',
    descricao: '',
    categorias: [] as string[],
    site: '',
  };

  arquivosSelecionados: File[] = [];
  private empresaDraft: EmpresaDraft | null = null;
  categoriasPadrao = [
    'Tecnologia',
    'Alimentação',
    'Roupas',
    'Serviços',
    'Saúde',
    'Beleza',
    'Educação',
    'Esportes',
    'Automotivo',
    'Construção',
    'Pets',
    'Lazer',
    'Imobiliário',
    'Financeiro',
  ];
  horarios: HorarioForm[] = [
    { dia: 'Seg', abre: '09:00', fecha: '18:00', atende: true },
    { dia: 'Ter', abre: '09:00', fecha: '18:00', atende: true },
    { dia: 'Qua', abre: '09:00', fecha: '18:00', atende: true },
    { dia: 'Qui', abre: '09:00', fecha: '18:00', atende: true },
    { dia: 'Sex', abre: '09:00', fecha: '18:00', atende: true },
    { dia: 'Sab', abre: '09:00', fecha: '13:00', atende: true },
    { dia: 'Dom', abre: '', fecha: '', atende: false },
  ];

  dropdownCategoriasAberto = false;
  termoCategoria = '';

  constructor(
    private router: Router,
    private negocioService: NegocioApiService,
    private authService: AuthService,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.empresaDraft = this.obterDraft();
    if (this.empresaDraft) {
      this.detalhesEmpresa.nomeResponsavel = this.empresaDraft.nomeResponsavel || '';
      this.detalhesEmpresa.contato = this.empresaDraft.telefone || '';
    }
  }

  realizarCadastro(): void {
    if (!this.empresaDraft) {
      this.mensagemErro = 'Finalize primeiro o cadastro da empresa.';
      return;
    }

    this.cadastroSucesso = false;
    this.mensagemErro = '';
    this.carregando = true;

    const enderecoPayload = this.montarEnderecoPayload();

    this.negocioService.criarEndereco(enderecoPayload).subscribe({
      next: (enderecoRes) => {
        this.criarNegocio(enderecoRes.id);
      },
      error: (erro: any) => this.tratarErro(this.mapErro('endereço', erro)),
    });
  }


  fecharModal(): void {
    this.cadastroSucesso = false;
    this.mensagemErro = '';
  }

  formatarCep(cep: string): string {
    return cep.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
  }

  formatarContato(valor: string) {
    let value = (valor || '').replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
      value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    this.detalhesEmpresa.contato = value;
  }

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
    event.target.value = '';
  }

  removerArquivo(index: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.arquivosSelecionados.splice(index, 1);
  }

  cancelar(): void {
    this.limparDraft();
    this.authService.limparSessao();
    this.router.navigate(['/login']);
  }

  private montarEnderecoPayload() {
    return {
      rua: this.detalhesEmpresa.rua || 'Endereço não informado',
      numero: this.detalhesEmpresa.numero || 's/n',
      bairro: this.detalhesEmpresa.bairro || '',
      cidade: this.detalhesEmpresa.cidade || '',
      estado: this.detalhesEmpresa.estado || '',
      cep: this.detalhesEmpresa.cep || '',
    };
  }

  @HostListener('document:click', ['$event'])
  onDocumentoClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropdownCategoriasAberto = false;
    }
  }

  get categoriasFiltradas(): string[] {
    const termo = this.termoCategoria.trim().toLowerCase();
    if (!termo) return this.categoriasPadrao;
    return this.categoriasPadrao.filter((c) => c.toLowerCase().includes(termo));
  }

  private criarNegocio(enderecoId: number) {
    if (!this.empresaDraft) return;

    const usuarioId = this.authService.obterUsuarioId();
    if (!usuarioId) {
      this.tratarErro('Faça login novamente para vincular o negócio ao seu usuário.');
      return;
    }

    this.negocioService
      .criarNegocio({
        nome_dono: this.detalhesEmpresa.nomeResponsavel || this.empresaDraft.nomeResponsavel,
        email: this.empresaDraft.email,
        cnpj: this.empresaDraft.cnpj,
        nome_estabelecimento: this.empresaDraft.nomeEmpresa,
        descricao: this.detalhesEmpresa.descricao,
        faixa_preco: 1,
        telefone: this.empresaDraft.telefone,
        whatsapp: this.detalhesEmpresa.contato || this.empresaDraft.telefone,
        url_instagram: undefined,
        url_site: this.detalhesEmpresa.site || undefined,
        usuario_id: usuarioId,
        endereco_id: enderecoId,
        categoria_nomes: this.detalhesEmpresa.categorias?.length ? this.detalhesEmpresa.categorias : ['Geral'],
        senha: this.empresaDraft.senha,
      })
      .subscribe({
        next: (negocioCriado) => {
          this.salvarHorarios(negocioCriado.id).subscribe({
            next: () => this.enviarFotos(negocioCriado.id),
            error: (erro: any) => {
              console.error('Erro ao salvar horários', erro);
              this.enviarFotos(negocioCriado.id);
            },
          });
        },
        error: (erro: any) => this.tratarErro(this.mapErro('negócio', erro)),
      });
  }

  toggleDropdownCategorias(): void {
    this.dropdownCategoriasAberto = !this.dropdownCategoriasAberto;
  }

  selecionarCategoria(cat: string): void {
    if (!cat) return;
    const selecionada = this.detalhesEmpresa.categorias.includes(cat);
    this.detalhesEmpresa.categorias = selecionada
      ? this.detalhesEmpresa.categorias.filter((c) => c !== cat)
      : [...this.detalhesEmpresa.categorias, cat];
  }

  fecharDropdown(): void {
    this.dropdownCategoriasAberto = false;
  }

  categoriaSelecionada(cat: string): boolean {
    return this.detalhesEmpresa.categorias.includes(cat);
  }

  selecionarTodasFiltradas(): void {
    const filtradas = this.categoriasFiltradas;
    const todasJaSelecionadas = filtradas.every((c) => this.categoriaSelecionada(c));
    if (todasJaSelecionadas) {
      this.detalhesEmpresa.categorias = this.detalhesEmpresa.categorias.filter(
        (c) => !filtradas.includes(c)
      );
    } else {
      const set = new Set([...this.detalhesEmpresa.categorias, ...filtradas]);
      this.detalhesEmpresa.categorias = Array.from(set);
    }
  }

  removerCategoria(cat: string): void {
    this.detalhesEmpresa.categorias = this.detalhesEmpresa.categorias.filter((c) => c !== cat);
  }

  private salvarHorarios(negocioId: number): Observable<any> {
    const payloads = this.horarios
      .filter((h) => h.abre || h.fecha || h.atende)
      .map((h) => {
        const horario_abre = this.normalizarHora(h.abre) || '09:00';
        const horario_fecha = this.normalizarHora(h.fecha) || '18:00';
        const aberto = !!(h.atende ?? (h.abre || h.fecha));
        return {
          dia_semana: h.dia,
          horario_abre,
          horario_fecha,
          aberto,
          negocio_id: negocioId,
        };
      });

    if (!payloads.length) {
      return of(null);
    }

    return forkJoin(payloads.map((p) => this.negocioService.criarHorario(p)));
  }

  private normalizarHora(valor: string): string {
    if (!valor) return '';
    const ajustada = valor.length === 4 ? `0${valor}` : valor;
    if (/^\d{2}:\d{2}$/.test(ajustada)) {
      return ajustada;
    }
    return '';
  }

  private enviarFotos(negocioId: number) {
    if (this.arquivosSelecionados.length > 0) {
      this.negocioService.enviarFotos(negocioId, this.arquivosSelecionados).subscribe({
        next: () => this.finalizarComSucesso(),
        error: (erro: any) => {
          console.error('Erro ao enviar fotos', erro);
          this.finalizarComSucesso(); // não bloqueia se falhar upload
        },
      });
    } else {
      this.finalizarComSucesso();
    }
  }

  private obterDraft(): EmpresaDraft | null {
    try {
      const raw = localStorage.getItem('empresaRegistro');
      return raw ? (JSON.parse(raw) as EmpresaDraft) : null;
    } catch {
      return null;
    }
  }

  private limparDraft(): void {
    localStorage.removeItem('empresaRegistro');
  }

  private tratarErro(msg: string) {
    this.carregando = false;
    this.mensagemErro = msg;
  }

  private finalizarComSucesso() {
    this.carregando = false;
    this.cadastroSucesso = true;
    this.limparDraft();
    setTimeout(() => {
      this.router.navigate(['/comerciante']);
    }, 1200);
  }

  private mapErro(contexto: string, erro: any): string {
    console.error(`Erro ao salvar ${contexto}`, erro);
    if (erro?.error?.detail) {
      return `Não foi possível salvar o ${contexto}: ${erro.error.detail}`;
    }
    if (erro?.status === 409) {
      return 'CNPJ ou e-mail já cadastrado.';
    }
    if (erro?.status === 404) {
      return 'Usuário ou categoria não encontrados. Faça login novamente.';
    }
    return 'Não foi possível salvar o negócio. Confira os dados e tente novamente.';
  }
}
