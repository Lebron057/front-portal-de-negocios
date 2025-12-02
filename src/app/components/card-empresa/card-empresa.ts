import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-card-empresa',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-empresa.html',
  styleUrls: ['./card-empresa.css'],
})
export class CardEmpresa {
  @Input() empresa: any;
  empresas = [
    {
      id: 'jacto-tech',
      nome: 'Jacto Tech',
      imagem_url: 'jacto.png',
      descricao: 'Empresa de tecnologia especializada em soluções inovadoras voltada para o agronegócio.',
      endereco: 'Endereço da Empresa A',
      telefone: '(11) 1234-5678',
      status: 'Aberto',
      horario: '08:00 - 18:00',
      categoria: ['Tecnologia', 'Agronegócio', 'Inovação', 'Soluções'],
    },
    {
      id: 'dom-galeto',
      nome: 'Dom Galeto',
      imagem_url: 'galeto.jpg',
      descricao: 'Restaurante self-service com ambiente familiar.',
      endereco: 'Endereço da Empresa B',
      telefone: '(11) 9876-5432',
      status: 'Fechado',
      horario: '11:00 - 14:00',
      categoria: ['Restaurante', 'Self-service', 'Comida Brasileira']
    },
    {
      id: 'supermercado-pompeia',
      nome: 'Supermercado Pompeia',
      imagem_url: 'supermercado_pompeia.png',
      descricao: 'Supermercado com variedade de produtos e ofertas especiais.',
      endereco: 'Endereço da Empresa C',
      telefone: '(11) 2468-1357',
      status: 'Aberto',
      horario: '07:00 - 22:00',
      categoria: ['Supermercado', 'Ofertas', 'Variedade', 'Produtos']
    },
    {
      id: 'dom-galeto-2',
      nome: 'Dom Galeto',
      imagem_url: 'galeto.jpg',
      descricao: 'Restaurante self-service com ambiente familiar.',
      endereco: 'Endereço da Empresa B',
      telefone: '(11) 9876-5432',
      status: 'Fechado',
      horario: '11:00 - 14:00',
      categoria: ['Restaurante', 'Self-service', 'Comida Brasileira']
    }
  ];
}
