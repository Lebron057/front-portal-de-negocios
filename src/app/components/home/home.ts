import { Component, OnInit } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CardEmpresa } from '../card-empresa/card-empresa';
import { CommonModule } from '@angular/common';

interface Empresa {
  nome: string;
  imagem_url: string;
  descricao: string;
  endereco: string;
  telefone: string;
  status: 'Aberto' | 'Fechado';
  horario: string;
  categoria: string[];
  bairro?: string; 
}

interface SecaoCategoria {
  titulo: string;
  empresas: Empresa[];
}

@Component({
  selector: 'app-home',
  imports: [Navbar, CardEmpresa, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Dados brutos (sua lista completa)
  todasEmpresas: Empresa[] = [
    {
      nome: 'Jacto Tech',
      imagem_url: 'jacto.png',
      descricao: 'Soluções inovadoras para o agronegócio.',
      endereco: 'Rua A, 100',
      telefone: '(11) 1234-5678',
      status: 'Aberto',
      horario: '08:00 - 18:00',
      categoria: ['Agronegócio', 'Tecnologia'],
      bairro: 'Zona Norte'
    },
    {
      nome: 'Dom Galeto',
      imagem_url: 'galeto.jpg',
      descricao: 'Restaurante self-service.',
      endereco: 'Rua B, 200',
      telefone: '(11) 9876-5432',
      status: 'Fechado',
      horario: '11:00 - 14:00',
      categoria: ['Restaurante'],
      bairro: 'Centro'
    },
    {
      nome: 'Bistrô Sabor & Arte',
      imagem_url: 'https://placehold.co/600x400/purple/white?text=Bistro',
      descricao: 'Gastronomia contemporânea.',
      endereco: 'Rua Principal, 500',
      telefone: '(14) 3452-0000',
      status: 'Aberto',
      horario: '18:00 - 23:00',
      categoria: ['Restaurante'],
      bairro: 'Zona Sul'
    },
    {
      nome: 'Supermercado Pompeia',
      imagem_url: 'supermercado_pompeia.png',
      descricao: 'Supermercado com variedade.',
      endereco: 'Endereço da Empresa C',
      telefone: '(11) 2468-1357',
      status: 'Aberto',
      horario: '07:00 - 22:00',
      categoria: ['Supermercado'],
      bairro: 'Centro'
    },
    {
        nome: 'Loja Estilo Atual',
        imagem_url: 'https://placehold.co/600x400/pink/white?text=Moda',
        descricao: 'Moda masculina e feminina.',
        endereco: 'Av. da Moda, 101',
        telefone: '(14) 9999-8888',
        status: 'Aberto',
        horario: '09:00 - 18:00',
        categoria: ['Vestuário & Moda'],
        bairro: 'Centro'
    }
  ];

  // Variável que será usada no HTML para renderizar as sessões
  secoesPorCategoria: SecaoCategoria[] = [];

  // Filtros
  categorias: string[] = ['Restaurante', 'Agronegócio', 'Supermercado', 'Vestuário & Moda'];
  bairros: string[] = ['Centro', 'Zona Sul', 'Zona Norte'];
  
  filtros = {
    categoria: '',
    bairro: '',
    abertoAgora: false
  };

  ngOnInit(): void {
    this.atualizarSecoes();
  }

  /**
   * Função mágica: Transforma a lista plana em lista de seções
   */
  atualizarSecoes() {
    let categoriasParaExibir: string[] = [];

    if (this.filtros.categoria && this.filtros.categoria !== '') {
      categoriasParaExibir = [this.filtros.categoria];
    } else {
      // Usa as categorias definidas ou extrai dinamicamente se preferir
      const todasAsCats = new Set<string>();
      this.todasEmpresas.forEach(emp => {
        emp.categoria.forEach(cat => todasAsCats.add(cat));
      });
      categoriasParaExibir = Array.from(todasAsCats);
    }

    this.secoesPorCategoria = [];

    categoriasParaExibir.forEach(catNome => {
      // Filtra as empresas que possuem essa categoria
      let empresasDaCategoria = this.todasEmpresas.filter(emp => 
        emp.categoria.includes(catNome)
      );

      // Aplica os outros filtros (Bairro, Aberto Agora) DENTRO do grupo
      if (this.filtros.bairro && this.filtros.bairro !== '') {
        empresasDaCategoria = empresasDaCategoria.filter(e => e.bairro === this.filtros.bairro);
      }
      if (this.filtros.abertoAgora) {
        empresasDaCategoria = empresasDaCategoria.filter(e => e.status === 'Aberto');
      }

      // Só cria a seção se houver empresas nela
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
    this.atualizarSecoes();
  }

  atualizarBairro(event: any) {
    this.filtros.bairro = event.target.value;
    this.atualizarSecoes();
  }

  toggleAbertoAgora(event: any) {
    this.filtros.abertoAgora = event.target.checked;
    this.atualizarSecoes();
  }

  aplicarFiltros() {
    this.atualizarSecoes();
  }
}
