import { Component, OnDestroy, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CardEmpresa } from '../card-empresa/card-empresa';
import { CommonModule } from '@angular/common';
import { NegocioApiService, NegocioApi } from '../../services/negocio.service';


interface Empresa {
  id: number;
  nome: string;
  imagem_url: string;
  descricao: string;
  endereco: string;
  telefone: string;
  status: 'Aberto' | 'Fechado';
  horario: string;
  categoria: string[];
  bairro?: string;
  horarios?: any[];
}

interface SecaoCategoria {
  titulo: string;
  empresas: Empresa[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Navbar, CardEmpresa, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  todasEmpresas: Empresa[] = [];

  // Variável que será usada no HTML para renderizar as sessões
  secoesPorCategoria: SecaoCategoria[] = [];

  // Filtros
  categorias: string[] = [];
  bairros: string[] = [];

  filtros = {
    categoria: '',
    bairro: '',
    abertoAgora: false
  };

  carregando = true;
  erro = '';

  private handleStatusEvento = (event: any) => {
    if (event?.key && event.key !== 'negociosStatusManual') return;
    this.reaplicarStatusManual();
  };

  constructor(private negocioService: NegocioApiService) {}

  ngOnInit(): void {
    this.carregarNegocios();
    window.addEventListener('storage', this.handleStatusEvento);
    window.addEventListener('negocioStatusAtualizado', this.handleStatusEvento as EventListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.handleStatusEvento);
    window.removeEventListener('negocioStatusAtualizado', this.handleStatusEvento as EventListener);
  }

  private carregarNegocios() {
    this.carregando = true;
    this.erro = '';
    this.negocioService.listarNegocios().subscribe({
      next: (lista) => {
        this.todasEmpresas = lista.map((n) => this.mapearEmpresa(n));
        this.atualizarFiltros();
        this.atualizarSecoes();
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar negócios', erro);
        this.erro = 'Não foi possível carregar os negócios. Tente novamente.';
        this.carregando = false;
      },
    });
  }

  private atualizarFiltros() {
    const cats = new Set<string>();
    const bairs = new Set<string>();
    this.todasEmpresas.forEach((e) => {
      e.categoria.forEach((c) => cats.add(c));
      if (e.bairro) bairs.add(e.bairro);
    });
    this.categorias = Array.from(cats);
    this.bairros = Array.from(bairs);
  }

  /**
   * Função mágica: Transforma a lista plana em lista de seções
   */
  atualizarSecoes() {
    let categoriasParaExibir: string[] = [];

    if (this.filtros.categoria && this.filtros.categoria !== '') {
      categoriasParaExibir = [this.filtros.categoria];
    } else {
      const todasAsCats = new Set<string>();
      this.todasEmpresas.forEach(emp => {
        emp.categoria.forEach(cat => todasAsCats.add(cat));
      });
      categoriasParaExibir = Array.from(todasAsCats);
    }

    this.secoesPorCategoria = [];

    categoriasParaExibir.forEach(catNome => {
      let empresasDaCategoria = this.todasEmpresas.filter(emp =>
        emp.categoria.includes(catNome)
      );

      if (this.filtros.bairro && this.filtros.bairro !== '') {
        empresasDaCategoria = empresasDaCategoria.filter(e => e.bairro === this.filtros.bairro);
      }
      if (this.filtros.abertoAgora) {
        empresasDaCategoria = empresasDaCategoria.filter(e => e.status === 'Aberto');
      }

      if (empresasDaCategoria.length > 0) {
        this.secoesPorCategoria.push({
          titulo: catNome,
          empresas: empresasDaCategoria
        });
      }
    });

    this.secoesPorCategoria.sort((a, b) => a.titulo.localeCompare(b.titulo));
  }

  // --- Métodos de filtro ---

  atualizarCategoria(event: any) {
    this.filtros.categoria = event.target.value;
  }

  atualizarBairro(event: any) {
    this.filtros.bairro = event.target.value;
  }

  toggleAbertoAgora(event: any) {
    this.filtros.abertoAgora = event.target.checked;
  }

  aplicarFiltros() {
    this.atualizarSecoes();
  }

  private mapearEmpresa(n: NegocioApi): Empresa {
    const endereco = n.endereco;
    const linhaEndereco = endereco
      ? `${endereco.rua || ''} ${endereco.numero || ''}`.trim() || 'Endereço não informado'
      : 'Endereço não informado';
    const bairro = endereco?.bairro;
    const imagem = n.fotos && n.fotos.length
      ? `${this.negocioService.baseUrl}${n.fotos[0].url}`
      : 'https://placehold.co/600x400/0ea5e9/ffffff?text=Neg%C3%B3cio';

    const manual = this.obterStatusManual(n.id);
    const horarios = (n.horarios || []).filter((h) => h.aberto);
    const horarioHoje = this.pegarHorarioDoDia(horarios);
    const horario_abre = horarioHoje?.horario_abre || '';
    const horario_fecha = horarioHoje?.horario_fecha || '';
    const horarioTexto =
      horario_abre && horario_fecha
        ? `${horario_abre.toString().slice(0, 5)} - ${horario_fecha.toString().slice(0, 5)}`
        : 'Horário não informado';

    const abertoAgora = this.estaAbertoAgora(horarios);
    const statusFinal = manual === null ? (abertoAgora ? 'Aberto' : 'Fechado') : manual ? 'Aberto' : 'Fechado';

    return {
      id: n.id,
      nome: n.nome_estabelecimento || 'Negócio sem nome',
      imagem_url: imagem,
      descricao: n.descricao || 'Descrição não informada',
      endereco: linhaEndereco,
      telefone: n.telefone || n.whatsapp || 'Contato não informado',
      status: statusFinal,
      horario: horarioTexto,
      categoria: n.categorias?.length
        ? n.categorias.map((c) => c.nome)
        : n.categoria?.nome
        ? [n.categoria.nome]
        : ['Sem categoria'],
      bairro,
      horarios,
    };
  }

  private reaplicarStatusManual() {
    this.todasEmpresas = this.todasEmpresas.map((e) => {
      const manual = this.obterStatusManual(e.id);
      const abertoAgora = this.estaAbertoAgora(e.horarios || []);
      const status = manual === null ? (abertoAgora ? 'Aberto' : 'Fechado') : manual ? 'Aberto' : 'Fechado';
      return { ...e, status };
    });
    this.atualizarSecoes();
  }

  private obterStatusManual(negocioId: number): boolean | null {
    const raw = localStorage.getItem('negociosStatusManual');
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, { aberto: boolean; data: string }>;
    const registro = data[negocioId];
    if (!registro) return null;

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

  private pegarHorarioDoDia(horarios: any[]): any | null {
    const hoje = this.normalizarDia(
      ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][new Date().getDay()]
    );
    return horarios.find((h) => this.normalizarDia(h.dia_semana) === hoje) || horarios[0] || null;
  }

  private estaAbertoAgora(horarios: any[]): boolean {
    if (!horarios.length) return false;
    const agora = new Date();
    const diaAtual = this.normalizarDia(
      ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][agora.getDay()]
    );
    const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

    return horarios
      .filter((h) => h.aberto && this.normalizarDia(h.dia_semana) === diaAtual)
      .some((h) => {
        const abre = this.converterParaMinutos(h.horario_abre);
        const fecha = this.converterParaMinutos(h.horario_fecha);
        if (abre === null || fecha === null) return false;
        return minutosAgora >= abre && minutosAgora < fecha;
      });
  }

  private converterParaMinutos(hora: any): number | null {
    if (!hora) return null;
    const str = hora.toString();
    const [h, m] = str.split(':').map((v: string) => parseInt(v, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  }
}
