import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';

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
export class Comerciante {
  // Disponibiliza Math no template para arredondar notas
  Math = Math;
  usuarioNome = 'Leonardo Oliveira';
  estabelecimentoAberto = true;

  negocios: Negocio[] = [
    {
      id: 1,
      nome: 'Dom Galeto',
      categoria: 'Restaurante • Self-service',
      cidade: 'Pompeia, SP',
      status: 'Ativo',
      aberto: true,
      cep: '17580-000',
      endereco: 'Av. Brasil, 1200',
      contato: '(18) 99999-8888',
      descricao: 'Galeteria com pratos rápidos e atendimento familiar.',
      imagens: [],
      horarios: [
        { dia: 'Seg', abre: '09:00', fecha: '18:00', atende: true },
        { dia: 'Ter', abre: '09:00', fecha: '18:00', atende: true },
        { dia: 'Qua', abre: '09:00', fecha: '18:00', atende: true },
        { dia: 'Qui', abre: '09:00', fecha: '18:00', atende: true },
        { dia: 'Sex', abre: '09:00', fecha: '18:00', atende: true },
        { dia: 'Sáb', abre: '10:00', fecha: '16:00', atende: true },
        { dia: 'Dom', abre: '', fecha: '', atende: false },
      ],
    },
    {
      id: 2,
      nome: 'Dom Galeto Express',
      categoria: 'Delivery • Assados',
      cidade: 'Marília, SP',
      status: 'Inativo',
      aberto: false,
      cep: '17500-120',
      endereco: 'Rua das Flores, 45',
      contato: '(14) 98888-7777',
      descricao: 'Versão delivery focada em assados rápidos.',
      imagens: [],
      horarios: [
        { dia: 'Seg', abre: '11:00', fecha: '22:00', atende: true },
        { dia: 'Ter', abre: '11:00', fecha: '22:00', atende: true },
        { dia: 'Qua', abre: '11:00', fecha: '22:00', atende: true },
        { dia: 'Qui', abre: '11:00', fecha: '22:00', atende: true },
        { dia: 'Sex', abre: '11:00', fecha: '23:00', atende: true },
        { dia: 'Sáb', abre: '11:00', fecha: '23:00', atende: true },
        { dia: 'Dom', abre: '11:00', fecha: '21:00', atende: true },
      ],
    },
  ];

  negocioAtivo: Negocio = this.negocios[0];
  modoLista = true;

  avaliacaoGeral = {
    nota: 4.6,
    totalAvaliacoes: 128, 
    comentariosRecentes: 12,
    nps: 72,
  };

  indicadores: Indicador[] = [
    {
      label: 'Comentários recentes',
      valor: `${this.avaliacaoGeral.comentariosRecentes}`,
      descricao: 'Últimos 30 dias',
    },
    {
      label: 'Avaliações totais',
      valor: `${this.avaliacaoGeral.totalAvaliacoes}`,
      descricao: 'Acumulado',
    },
    {
      label: 'NPS estimado',
      valor: `${this.avaliacaoGeral.nps}`,
      descricao: 'Clientes promotores',
    },
  ];

  comentariosClientes: ComentarioCliente[] = [
    {
      cliente: 'Amanda Souza',
      cidade: 'Pompeia, SP',
      data: 'Hoje • 12:10',
      nota: 5,
      titulo: 'Equipe atenciosa',
      texto:
        'Cheguei com crianças pequenas e já prepararam cadeirões e pratos infantis. Atendimento rápido e gentil.',
    },
    {
      cliente: 'João Victor',
      cidade: 'Marília, SP',
      data: 'Ontem • 19:45',
      nota: 4,
      titulo: 'Galeto bem temperado',
      texto: 'O galeto é ótimo e chegou quentinho. Só sugeriria mais opções de acompanhamento.',
    },
    {
      cliente: 'Lívia Martins',
      cidade: 'Pompeia, SP',
      data: '13 Nov • 21:15',
      nota: 3,
      titulo: 'Entrega demorou',
      texto:
        'Pedido chegou correto, mas demorou cerca de 30 minutos a mais que o previsto. Fui informada, o que ajudou.',
    },
  ];

  ratingScale = [1, 2, 3, 4, 5];
  showModal = false;
  negocioSelecionado: Negocio | null = null;
  negocioForm: Negocio | null = null;

  get statusTexto(): string {
    return this.negocioAtivo?.aberto ? 'Aberto agora' : 'Fechado no momento';
  }

  get statusBadgeClasse(): string {
    return this.negocioAtivo?.aberto ? 'status status--aberto' : 'status status--fechado';
  }

  get statusAcao(): string {
    return this.negocioAtivo?.aberto ? 'Marcar como Fechado' : 'Marcar como Aberto';
  }

  toggleStatus(): void {
    this.negocioAtivo.aberto = !this.negocioAtivo.aberto;
  }

  toggleNegocioStatus(negocio: Negocio): void {
    negocio.status = negocio.status === 'Ativo' ? 'Inativo' : 'Ativo';
  }

  adicionarNegocio(): void {
    const novoId = this.negocios.length ? Math.max(...this.negocios.map((n) => n.id)) + 1 : 1;
    const novo: Negocio = {
      id: novoId,
      nome: `Novo Negócio ${novoId}`,
      categoria: 'Definir categoria',
      cidade: 'Definir cidade',
      status: 'Inativo',
      aberto: false,
      cep: '',
      endereco: '',
      contato: '',
      descricao: '',
      imagens: [],
      horarios: [
        { dia: 'Seg', abre: '', fecha: '', atende: false },
        { dia: 'Ter', abre: '', fecha: '', atende: false },
        { dia: 'Qua', abre: '', fecha: '', atende: false },
        { dia: 'Qui', abre: '', fecha: '', atende: false },
        { dia: 'Sex', abre: '', fecha: '', atende: false },
        { dia: 'Sáb', abre: '', fecha: '', atende: false },
        { dia: 'Dom', abre: '', fecha: '', atende: false },
      ],
    };
    this.negocios = [...this.negocios, novo];
  }

  removerNegocio(negocio: Negocio): void {
    this.negocios = this.negocios.filter((n) => n.id !== negocio.id);
    if (this.negocioAtivo.id === negocio.id && this.negocios.length) {
      this.negocioAtivo = this.negocios[0];
    }
  }

  abrirModal(negocio: Negocio): void {
    this.negocioSelecionado = negocio;
    // cria cópia rasa para edição
    this.negocioForm = JSON.parse(JSON.stringify(negocio));
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.negocioSelecionado = null;
    this.negocioForm = null;
  }

  salvarAlteracoes(): void {
    if (!this.negocioForm) return;
    this.negocios = this.negocios.map((n) =>
      n.id === this.negocioForm!.id ? { ...this.negocioForm! } : n
    );
    if (this.negocioAtivo.id === this.negocioForm.id) {
      this.negocioAtivo = { ...this.negocioForm };
    }
    this.fecharModal();
  }

  verDetalhes(negocio: Negocio): void {
    this.negocioAtivo = negocio;
    this.modoLista = false;
  }

  voltarLista(): void {
    this.modoLista = true;
  }
}
