import { Component } from '@angular/core';

@Component({
  selector: 'app-card-empresa',
  imports: [],
  templateUrl: './card-empresa.html',
  styleUrl: './card-empresa.css',
})
export class CardEmpresa {
  empresas = [
    {
      nome: 'Jacto Tech',
      imagem_url: 'jacto.png',
      descricao: 'Empresa de tecnologia especializada em soluções inovadoras voltada para o agronegócio.',
      endereco: 'Endereço da Empresa A',
      telefone: '(11) 1234-5678',
      status: 'Aberto',
      horario: '08:00 - 18:00',
      categoria: ['Agronegócio', 'Tecnologia'],
    },
    {
      nome: 'Dom Galeto',
      imagem_url: 'galeto.jpg',
      descricao: 'Restaurante self-service com ambiente familiar.',
      endereco: 'Endereço da Empresa B',
      telefone: '(11) 9876-5432',
      status: 'Fechado',
      horario: '11:00 - 14:00',
      categoria: ['Restaurante']
    },
    {
      nome: 'Supermercado Pompeia',
      imagem_url: 'supermercado_pompeia.png',
      descricao: 'Supermercado com variedade de produtos e ofertas especiais.',
      endereco: 'Endereço da Empresa C',
      telefone: '(11) 2468-1357',
      status: 'Aberto',
      horario: '07:00 - 22:00',
      categoria: ['Mercado']
    },
    {
      nome: 'Dom Galeto',
      imagem_url: 'galeto.jpg',
      descricao: 'Restaurante self-service com ambiente familiar.',
      endereco: 'Endereço da Empresa B',
      telefone: '(11) 9876-5432',
      status: 'Fechado',
      horario: '11:00 - 14:00',
      categoria: ['Restaurante']
    },
    {
    nome: 'Bistrô Sabor & Arte',
    imagem_url: 'bistro.jpg',
    descricao: 'Gastronomia contemporânea e drinks artesanais.',
    endereco: 'Rua Principal, 500',
    telefone: '(14) 3452-0000',
    status: 'Aberto',
    horario: '18:00 - 23:00',
    categoria: ['Restaurante']
  },
  {
    nome: 'Loja Estilo Atual',
    imagem_url: 'loja_roupa.png',
    descricao: 'Moda masculina e feminina, do casual ao social.',
    endereco: 'Av. da Moda, 101',
    telefone: '(14) 9999-8888',
    status: 'Aberto',
    horario: '09:00 - 18:00',
    categoria: ['Vestuário & Moda']
  },
  {
    nome: 'Barbearia do Silva',
    imagem_url: 'barbearia.jpg',
    descricao: 'Corte, barba e produtos para cuidados masculinos.',
    endereco: 'Rua das Flores, 20',
    telefone: '(14) 3444-5555',
    status: 'Aberto',
    horario: '09:00 - 19:00',
    categoria: ['Saúde & Beleza']
  },
  {
    nome: 'Hortifruti Natural',
    imagem_url: 'hortifruti.png',
    descricao: 'Frutas, verduras e legumes frescos todos os dias.',
    endereco: 'Rua do Mercado, 33',
    telefone: '(14) 3333-2222',
    status: 'Fechado',
    horario: '07:00 - 20:00',
    categoria: ['Mercado']
  },
  {
    nome: 'Doutor Resolve',
    imagem_url: 'manutencao.jpg',
    descricao: 'Reparos elétricos, hidráulicos e pintura residencial.',
    endereco: 'Atendimento à Domicílio',
    telefone: '(14) 98888-7777',
    status: 'Aberto',
    horario: '08:00 - 18:00',
    categoria: ['Serviços Domésticos']
  },
  {
    nome: 'Mecânica Confiança',
    imagem_url: 'oficina.jpg',
    descricao: 'Manutenção automotiva, troca de óleo e pneus.',
    endereco: 'Av. Industrial, 400',
    telefone: '(14) 3400-1111',
    status: 'Aberto',
    horario: '08:00 - 18:00',
    categoria: ['Automotivo']
  }
  ];
}
