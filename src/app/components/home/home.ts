import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { CardEmpresa } from '../card-empresa/card-empresa';


@Component({
  selector: 'app-home',
  imports: [Navbar, CardEmpresa],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // 1. Categorias Essenciais
  categorias: string[] = [
    'Todos',
    'Restaurantes & Bares',
    'Vestuário & Moda',
    'Saúde & Beleza',
    'Mercados',
    'Serviços Domésticos',
    'Automotivo'
  ];

  // 2. Filtro de Localização (Bairros de Pompeia)
  bairros: string[] = [
    'Todos',
    'Centro',
    'Vila Paulina',
    'Jardim América',
    'Flândria',
    'Jardim Primavera',
    'Distrito Industrial'
  ];

  // Estado atual dos filtros
  filtros = {
    categoria: 'Todos',
    bairro: 'Todos',
    abertoAgora: true
  };

  // Métodos para capturar as mudanças
  atualizarCategoria(event: Event) {
    this.filtros.categoria = (event.target as HTMLSelectElement).value;
    // Removida a chamada imediata de this.aplicarFiltros()
  }

  atualizarBairro(event: Event) {
    this.filtros.bairro = (event.target as HTMLSelectElement).value;
  }

  toggleAbertoAgora(event: Event) {
    this.filtros.abertoAgora = (event.target as HTMLInputElement).checked;
  }

  aplicarFiltros() {
    console.log('Botão Buscar clicado! Filtros:', this.filtros);
    // Lógica de busca no backend aqui
  }
}
