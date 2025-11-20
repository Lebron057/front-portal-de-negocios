import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';

type SocialLinkType = 'whatsapp' | 'instagram' | 'facebook' | 'email';

interface SocialLink {
  type: SocialLinkType;
  label: string;
  href: string;
}

interface Company {
  name: string;
  category: string;
  rating: number;
  ratingCount: number;
  description: string;
  socials: SocialLink[];
}

interface ContactInfo {
  address: string;
  phone: string;
  cnpj: string;
}

interface ScheduleItem {
  day: string;
  hours: string;
}

interface Review {
  userInitial: string;
  userName: string;
  date: string;
  rating: number;
  text: string;
}

@Component({
  selector: 'app-ver-detalhes',
  imports: [Navbar, CommonModule],
  templateUrl: './ver-detalhes.html',
  styleUrl: './ver-detalhes.css',
})
export class VerDetalhes {
  company: Company = {
    name: 'Loja de Roupa Zé Mané',
    category: 'categoria',
    rating: 4.8,
    ratingCount: 153,
    description:
      'Moda masculina e feminina com as últimas tendências. Atendimento personalizado e peças exclusivas para todas as ocasiões.',
    socials: [
      { type: 'whatsapp', label: 'WA', href: '#' },
      { type: 'instagram', label: 'IG', href: '#' },
      { type: 'facebook', label: 'FB', href: '#' },
      { type: 'email', label: '@', href: '#' },
    ],
  };

  services: string[] = [
    'categoria',
    'categoria',
    'categoria',
    'categoria',
    'categoria',
    'categoria',
  ];

  contact: ContactInfo = {
    address: 'Av. Principal, 456 - Jardins, São Paulo - SP',
    phone: '(11) 97654-3210',
    cnpj: '12.345.678/0001-90',
  };

  schedule: ScheduleItem[] = [
    { day: 'Segunda', hours: '09:00 - 18:00' },
    { day: 'Terça', hours: '09:00 - 18:00' },
    { day: 'Quarta', hours: '09:00 - 18:00' },
    { day: 'Quinta', hours: '09:00 - 18:00' },
    { day: 'Sexta', hours: '09:00 - 18:00' },
    { day: 'Sábado', hours: '09:00 - 14:00' },
    { day: 'Domingo', hours: 'Fechado' },
  ];

  reviews: Review[] = [
    {
      userInitial: 'J',
      userName: 'Nome_usuario',
      date: '22 de outubro de 2025',
      rating: 5,
      text: 'Atendimento excepcional! Encontrei tudo que procurava e a vendedora foi super atenciosa.',
    },
    {
      userInitial: 'M',
      userName: 'Nome_usuario',
      date: '22 de outubro de 2025',
      rating: 4,
      text: 'Atendimento excepcional! Encontrei tudo que procurava e a vendedora foi super atenciosa.',
    },
  ];

  starRange = [1, 2, 3, 4, 5];

  getSocialClass(link: SocialLink): string {
    switch (link.type) {
      case 'whatsapp':
        return 'rede-whatsapp';
      case 'instagram':
        return 'rede-instagram';
      case 'facebook':
        return 'rede-facebook';
      default:
        return 'rede-email';
    }
  }
}
