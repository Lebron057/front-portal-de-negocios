import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

type StatusComentario = 'Publicado' | 'Pendente' | 'Respondido';

interface Comentario {
  id: number;
  empresa: string;
  titulo: string;
  texto: string;
  data: string;
  status: StatusComentario;
  nota: number;
  tags: string[];
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
})
export class Usuario {
  usuario = {
    nome: 'Amanda Souza',
    cidade: 'Pompeia, SP',
    desde: '2024',
    totalComentarios: 8,
    mediaNotas: 4.7,
    visitas: 12,
  };

  comentarios: Comentario[] = [
    {
      id: 1,
      empresa: 'Dom Galeto',
      titulo: 'Atendimento acolhedor e rápido',
      texto:
        'Fui no almoço e o pessoal já sabia do meu pedido. Comida saborosa e bem servida, ambiente limpo e organizado.',
      data: 'Hoje • 14:20',
      status: 'Publicado',
      nota: 5,
      tags: ['Almoço', 'Família', 'Takeaway'],
    },
    {
      id: 2,
      empresa: 'Jacto Tech',
      titulo: 'Equipe técnica que resolve',
      texto:
        'Precisei de suporte para o sistema de irrigação e fui atendida em menos de 24h. Deram visibilidade de cada etapa.',
      data: 'Ontem • 18:05',
      status: 'Respondido',
      nota: 4,
      tags: ['Suporte', 'Agronegócio'],
    },
    {
      id: 3,
      empresa: 'Supermercado Pompeia',
      titulo: 'Entrega podia ser mais rápida',
      texto:
        'Produtos chegaram ok, mas o prazo prometido era 2h e levou quase 4h. De qualquer forma, me ligaram avisando.',
      data: '12 Nov • 09:40',
      status: 'Pendente',
      nota: 3,
      tags: ['Entrega', 'Mercado online'],
    },
  ];

  ratingScale = [1, 2, 3, 4, 5];

  get iniciais(): string {
    return this.usuario.nome
      .split(' ')
      .filter((parte) => !!parte)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase();
  }

  get primeiroNome(): string {
    const [primeiro] = this.usuario.nome.split(' ').filter((parte) => !!parte);
    return primeiro || this.usuario.nome;
  }
}
