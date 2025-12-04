import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { NegocioApi, NegocioApiService } from '../../services/negocio.service';
import { UsuarioService } from '../../services/usuario.service';
import { AvaliacaoService, AvaliacaoApi } from '../../services/avaliacao.service';

interface Indicador {
  label: string;
  valor: string;
  descricao: string;
}

interface ComentarioCliente {
  cliente: string;
  cidade: string;
  data: string;
  nota: number;
  titulo: string;
  texto: string;
}

type StatusNegocio = 'Ativo' | 'Inativo';

interface HorarioDia {
  dia: string;
  abre: string;
  fecha: string;
  atende: boolean;
}

interface Negocio {
  id: number;
  nome: string;
  categoria: string;
  cidade: string;
  status: StatusNegocio;
  aberto: boolean;
  cep: string;
  endereco: string;
  contato: string;
  descricao: string;
  imagens: string[];
  horarios: HorarioDia[];
}

@Component({
  selector: 'app-comerciante',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './comerciante.html',
  styleUrls: ['./comerciante.css'],
})
export class Comerciante implements OnInit {
  // Disponibiliza Math no template para arredondar notas
  Math = Math;
  usuarioNome = '';
  estabelecimentoAberto = true;

  negocios: Negocio[] = [];
  dadosPessoais = {
    nome: '',
    email: '',
    telefone: '',
    cnpj: '',
  };

  negocioAtivo: Negocio | null = null;
  modoLista = true;

  avaliacaoGeral = {
    nota: 0,
    totalAvaliacoes: 0,
    comentariosRecentes: 0,
    nps: 0,
  };

  indicadores: Indicador[] = [];

  comentariosClientes: ComentarioCliente[] = [
  ];

  ratingScale = [1, 2, 3, 4, 5];
  showModal = false;
  negocioSelecionado: Negocio | null = null;
  negocioForm: Negocio | null = null;

  carregando = false;
  erro = '';

  constructor(
    private negocioService: NegocioApiService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private avaliacaoService: AvaliacaoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarDadosPessoais();
    this.carregarNegocios();
  }

  get statusTexto(): string {
    if (!this.negocioAtivo) return 'Fechado';
    return this.negocioAtivo.aberto ? 'Aberto agora' : 'Fechado manualmente';
  }

  get statusBadgeClasse(): string {
    if (!this.negocioAtivo) return 'status status--fechado';
    return this.negocioAtivo.aberto ? 'status status--aberto' : 'status status--fechado';
  }

  get statusAcao(): string {
    return this.negocioAtivo?.aberto ? 'Marcar como Fechado' : 'Marcar como Aberto';
  }

  toggleStatus(): void {
    if (!this.negocioAtivo) return;
    this.negocioAtivo.aberto = !this.negocioAtivo.aberto;
    this.salvarStatusManual(this.negocioAtivo.id, this.negocioAtivo.aberto);

    this.negocios = this.negocios.map((n) =>
      n.id === this.negocioAtivo!.id ? { ...n, aberto: this.negocioAtivo!.aberto } : n
    );
  }

  toggleNegocioStatus(negocio: Negocio): void {
    negocio.status = negocio.status === 'Ativo' ? 'Inativo' : 'Ativo';
  }

  adicionarNegocio(): void {
    this.router.navigate(['/register-detalhes-empresa']);
  }

  removerNegocio(negocio: Negocio): void {
    this.negocios = this.negocios.filter((n) => n.id !== negocio.id);
    if (this.negocioAtivo && this.negocioAtivo.id === negocio.id && this.negocios.length) {
      this.negocioAtivo = this.negocios[0];
    }
  }

  editarNegocio(negocio: Negocio): void {
    this.router.navigate(['/register-detalhes-empresa'], { queryParams: { negocioId: negocio.id } });
  }

  verDetalhes(negocio: Negocio): void {
    this.negocioAtivo = negocio;
    this.carregarAvaliacoes(negocio.id);
    this.modoLista = false;
  }

  voltarLista(): void {
    this.modoLista = true;
  }

  private carregarNegocios(): void {
    const perfil = this.authService.obterPerfilDoToken() || this.authService.obterPerfil();
    const usuarioId = this.authService.obterUsuarioId();
    const negocioId = this.authService.obterNegocioId();

    if (perfil !== 'empresa') {
      this.erro = 'Apenas contas de empresa podem acessar esta área.';
      this.carregando = false;
      return;
    }

    if (!usuarioId && !negocioId) {
      this.erro = 'Faça login novamente para carregar seus negócios.';
      return;
    }

    this.carregando = true;
    const filtros =
      perfil === 'empresa' && negocioId
        ? { negocioId }
        : { usuarioId: usuarioId || undefined };

    this.negocioService.listarNegocios(filtros).subscribe({
      next: (lista) => {
        this.negocios = lista.map((n) => this.mapearNegocio(n));
        this.negocioAtivo = this.negocios[0] || null;
        if (this.negocioAtivo) {
          this.carregarAvaliacoes(this.negocioAtivo.id);
        } else {
          this.atualizarIndicadores([]);
        }
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar negócios', erro);
        this.erro = 'Não foi possível carregar seus negócios.';
        this.carregando = false;
      },
    });
  }

  private carregarDadosPessoais(): void {
    const perfil = this.authService.obterPerfilDoToken() || this.authService.obterPerfil();
    const usuarioId = this.authService.obterUsuarioId();
    const negocioId = this.authService.obterNegocioId();

    if (perfil === 'empresa' && negocioId) {
      this.negocioService.obterNegocio(negocioId).subscribe({
        next: (n) => {
          this.dadosPessoais.nome = n.nome_dono || n.nome_estabelecimento || '';
          this.dadosPessoais.email = n.email || '';
          this.dadosPessoais.telefone = n.telefone || n.whatsapp || '';
          this.dadosPessoais.cnpj = n.cnpj || '';
          this.usuarioNome = this.dadosPessoais.nome;
        },
        error: () => {},
      });
    } else if (usuarioId) {
      this.usuarioService.obterUsuario(usuarioId).subscribe({
        next: (u) => {
          this.dadosPessoais.nome = u.nome || '';
          this.dadosPessoais.email = u.email || '';
          this.dadosPessoais.telefone = u.telefone || '';
          this.dadosPessoais.cnpj = '';
          this.usuarioNome = this.dadosPessoais.nome;
        },
        error: () => {},
      });
    }
  }

  private mapearNegocio(n: NegocioApi): Negocio {
    const abertoManual = this.obterStatusManual(n.id);
    const endereco = n.endereco;
    const imagens = (n.fotos || []).map((f) => `${this.negocioService.baseUrl}${f.url}`);
    const horarios: HorarioDia[] = (n.horarios || []).map((h) => ({
      dia: h.dia_semana,
      abre: h.horario_abre || '',
      fecha: h.horario_fecha || '',
      atende: h.aberto,
    }));
    const abertoAutomatico = this.estaAbertoAgora(horarios);
    const abertoFinal = abertoManual ?? abertoAutomatico;

    return {
      id: n.id,
      nome: n.nome_estabelecimento || 'Negócio sem nome',
      categoria:
        n.categorias?.map((c) => c.nome).join(', ') ||
        n.categoria?.nome ||
        'Categoria não informada',
      cidade: endereco?.cidade || 'Cidade não informada',
      status: 'Ativo',
      aberto: abertoFinal,
      cep: endereco?.cep || '',
      endereco: endereco ? `${endereco.rua || ''}, ${endereco.numero || ''}`.trim() : '',
      contato: n.telefone || n.whatsapp || 'Contato não informado',
      descricao: n.descricao || '',
      imagens,
      horarios: horarios.length
        ? horarios
        : [
            { dia: 'Seg', abre: '09:00', fecha: '18:00', atende: true },
            { dia: 'Ter', abre: '09:00', fecha: '18:00', atende: true },
            { dia: 'Qua', abre: '09:00', fecha: '18:00', atende: true },
            { dia: 'Qui', abre: '09:00', fecha: '18:00', atende: true },
            { dia: 'Sex', abre: '09:00', fecha: '18:00', atende: true },
            { dia: 'Sáb', abre: '09:00', fecha: '13:00', atende: true },
            { dia: 'Dom', abre: 'Fechado', fecha: '', atende: false },
          ],
    };
  }

  private carregarAvaliacoes(negocioId: number) {
    this.avaliacaoService.listarPorNegocio(negocioId).subscribe({
      next: (avaliacoes) => {
        this.comentariosClientes = this.mapearComentarios(avaliacoes);
        this.atualizarIndicadores(avaliacoes);
      },
      error: (erro) => {
        console.error('Erro ao carregar avaliações', erro);
        this.comentariosClientes = [];
        this.atualizarIndicadores([]);
      },
    });
  }

  private mapearComentarios(avaliacoes: AvaliacaoApi[]): ComentarioCliente[] {
    return avaliacoes.map((a) => {
      const dataFmt = a.data ? new Date(a.data).toLocaleString('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }) : 'Data não informada';
      return {
        cliente: (a as any).usuario?.nome || 'Cliente',
        cidade: this.negocioAtivo?.cidade || '',
        data: dataFmt,
        nota: a.nota || 0,
        titulo: a.titulo || 'Sem título',
        texto: a.comentario || '',
      };
    });
  }

  private atualizarIndicadores(avaliacoes: AvaliacaoApi[]) {
    const total = avaliacoes.length;
    const media = total ? avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0) / total : 0;
    const recentes = avaliacoes.slice(0, 5).length;
    const acessos = total; // proxy de acessos: total de avaliações recebidas

    this.avaliacaoGeral = {
      nota: Number(media.toFixed(1)),
      totalAvaliacoes: total,
      comentariosRecentes: recentes,
      nps: this.avaliacaoGeral.nps,
    };

    this.indicadores = [
      { label: 'Comentários', valor: `${total}`, descricao: 'Total de feedbacks' },
      { label: 'Média de notas', valor: media ? media.toFixed(1) : '0.0', descricao: 'Avaliações recebidas' },
      { label: 'Acessos', valor: `${acessos}`, descricao: 'Interações registradas' },
      { label: 'NPS estimado', valor: `${this.avaliacaoGeral.nps}`, descricao: 'Clientes promotores' },
    ];
  }

  private salvarStatusManual(negocioId: number, aberto: boolean) {
    const raw = localStorage.getItem('negociosStatusManual');
    const data = raw ? (JSON.parse(raw) as Record<string, { aberto: boolean; data: string }>) : {};
    data[negocioId] = { aberto, data: new Date().toISOString() };
    localStorage.setItem('negociosStatusManual', JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('negocioStatusAtualizado'));
  }

  private obterStatusManual(negocioId: number): boolean | null {
    const raw = localStorage.getItem('negociosStatusManual');
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, { aberto: boolean; data: string }>;
    const registro = data[negocioId];
    if (!registro) return null;

    // Se o registro é de outra data, ignora (novo dia volta ao horário automático)
    const hoje = new Date().toDateString();
    const dataRegistro = new Date(registro.data).toDateString();
    if (hoje !== dataRegistro) return null;

    if (typeof registro.aberto === 'boolean') return registro.aberto;
    return null;
  }

  private normalizarDia(dia: string): string {
    const mapa: Record<string, string> = {
      Domingo: 'Dom',
      Segunda: 'Seg',
      'Segunda-feira': 'Seg',
      Terca: 'Ter',
      Terça: 'Ter',
      'Terça-feira': 'Ter',
      Quarta: 'Qua',
      'Quarta-feira': 'Qua',
      Quinta: 'Qui',
      'Quinta-feira': 'Qui',
      Sexta: 'Sex',
      'Sexta-feira': 'Sex',
      Sabado: 'Sab',
      Sábado: 'Sab',
    };
    return mapa[dia] || dia;
  }

  private converterParaMinutos(hora: string): number | null {
    if (!hora) return null;
    const str = hora.toString();
    if (str.toLowerCase() === 'fechado') return null;
    const [h, m] = str.split(':').map((v: string) => parseInt(v, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  }

  private estaAbertoAgora(horarios: HorarioDia[]): boolean {
    if (!horarios.length) return false;
    const agora = new Date();
    const diaAtual = this.normalizarDia(
      ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][agora.getDay()]
    );
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    return horarios
      .filter((h) => h.atende && this.normalizarDia(h.dia) === diaAtual)
      .some((h) => {
        const abre = this.converterParaMinutos(h.abre);
        const fecha = this.converterParaMinutos(h.fecha);
        if (abre === null || fecha === null) return false;
        return minutosAgora >= abre && minutosAgora < fecha;
      });
  }
}
