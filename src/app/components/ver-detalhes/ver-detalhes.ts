import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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
  logoUrl?: string;
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
  standalone: true,
  imports: [Navbar, CommonModule, RouterModule],
  templateUrl: './ver-detalhes.html',
  styleUrls: ['./ver-detalhes.css'],
})
export class VerDetalhes implements OnInit {
  heroImages: string[] = [];

  company: Company | null = null;

  services: string[] = [];

  contact: ContactInfo | null = null;

  schedule: ScheduleItem[] = [];

  reviews: Review[] = [];

  private companyData: Record<
    string,
    {
      company: Company;
      services: string[];
      contact: ContactInfo;
      schedule: ScheduleItem[];
      reviews: Review[];
      heroImages: string[];
    }
  > = {
    'jacto-tech': {
      company: {
        name: 'Jacto Tech',
        category: 'Tecnologia • Agronegócio',
        rating: 4.8,
        ratingCount: 153,
        description:
          'Especializada em soluções de tecnologia para o agronegócio, suporte ágil e equipamentos conectados.',
        socials: [
          { type: 'whatsapp', label: 'WA', href: '#' },
          { type: 'instagram', label: 'IG', href: '#' },
          { type: 'facebook', label: 'FB', href: '#' },
        ],
        logoUrl: '/jactoLogo.png',
      },
      services: ['Irrigação inteligente', 'Monitoramento remoto', 'Suporte 24/7', 'Treinamentos'],
      contact: {
        address: 'Av. Brasil, 1200 - Pompeia, SP',
        phone: '(18) 99999-8888',
        cnpj: '45.123.456/0001-00',
      },
      schedule: [
        { day: 'Segunda', hours: '09:00 - 18:00' },
        { day: 'Terça', hours: '09:00 - 18:00' },
        { day: 'Quarta', hours: '09:00 - 18:00' },
        { day: 'Quinta', hours: '09:00 - 18:00' },
        { day: 'Sexta', hours: '09:00 - 18:00' },
        { day: 'Sábado', hours: '10:00 - 14:00' },
        { day: 'Domingo', hours: 'Fechado' },
      ],
      reviews: [
        {
          userInitial: 'A',
          userName: 'Amanda',
          date: 'Hoje',
          rating: 5,
          text: 'Suporte técnico muito rápido, resolveram a integração no mesmo dia.',
        },
        {
          userInitial: 'R',
          userName: 'Rafael',
          date: 'Ontem',
          rating: 4,
          text: 'Equipamento robusto, poderia ter mais documentação em português.',
        },
      ],
      heroImages: ['/logoGaleto.jpg'],
    },
    'dom-galeto': {
      company: {
        name: 'Dom Galeto',
        category: 'Restaurante • Self-service',
        rating: 4.6,
        ratingCount: 128,
        description: 'Galeteria com ambiente familiar, pratos fartos e atendimento rápido.',
        socials: [
          { type: 'whatsapp', label: 'WA', href: '#' },
          { type: 'instagram', label: 'IG', href: '#' },
          { type: 'facebook', label: 'FB', href: '#' },
        ],
        logoUrl: '/favicon.png',
      },
      services: ['Galeto assado', 'Buffet self-service', 'Sobremesas caseiras', 'Delivery'],
      contact: {
        address: 'Rua das Acácias, 300 - Pompeia, SP',
        phone: '(18) 4002-8922',
        cnpj: '22.333.444/0001-11',
      },
      schedule: [
        { day: 'Segunda', hours: '11:00 - 15:00' },
        { day: 'Terça', hours: '11:00 - 15:00' },
        { day: 'Quarta', hours: '11:00 - 15:00' },
        { day: 'Quinta', hours: '11:00 - 15:00' },
        { day: 'Sexta', hours: '11:00 - 22:00' },
        { day: 'Sábado', hours: '11:00 - 22:00' },
        { day: 'Domingo', hours: '11:30 - 16:00' },
      ],
      reviews: [
        {
          userInitial: 'A',
          userName: 'Amanda Souza',
          date: 'Hoje',
          rating: 5,
          text: 'Equipe ágil e atenciosa, buffet variado e preço justo.',
        },
        {
          userInitial: 'J',
          userName: 'João Victor',
          date: 'Ontem',
          rating: 4,
          text: 'Galeto muito bem temperado, o delivery chegou no tempo.',
        },
      ],
      heroImages: ['/logoGaleto.jpg'],
    },
    'supermercado-pompeia': {
      company: {
        name: 'Supermercado Pompeia',
        category: 'Supermercado • Ofertas',
        rating: 4.3,
        ratingCount: 210,
        description: 'Variedade de produtos, hortifruti fresco e ofertas semanais.',
        socials: [
          { type: 'whatsapp', label: 'WA', href: '#' },
          { type: 'instagram', label: 'IG', href: '#' },
          { type: 'facebook', label: 'FB', href: '#' },
        ],
        logoUrl: '/favicon.png',
      },
      services: ['Hortifruti', 'Açougue', 'Padaria', 'Delivery programado'],
      contact: {
        address: 'Av. Central, 900 - Pompeia, SP',
        phone: '(18) 3232-1010',
        cnpj: '55.666.777/0001-55',
      },
      schedule: [
        { day: 'Segunda', hours: '07:00 - 22:00' },
        { day: 'Terça', hours: '07:00 - 22:00' },
        { day: 'Quarta', hours: '07:00 - 22:00' },
        { day: 'Quinta', hours: '07:00 - 22:00' },
        { day: 'Sexta', hours: '07:00 - 22:00' },
        { day: 'Sábado', hours: '07:00 - 22:00' },
        { day: 'Domingo', hours: '08:00 - 20:00' },
      ],
      reviews: [
        {
          userInitial: 'L',
          userName: 'Luisa',
          date: '12 Nov',
          rating: 4,
          text: 'Hortifruti sempre fresco, caixa rápido no horário da manhã.',
        },
        {
          userInitial: 'C',
          userName: 'Carlos',
          date: '10 Nov',
          rating: 3,
          text: 'Entrega atrasou uma vez, mas avisaram e deram desconto.',
        },
      ],
      heroImages: ['/logoGaleto.jpg'],
    },
  };

  starRange = [1, 2, 3, 4, 5];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id || !this.companyData[id]) {
        this.router.navigate(['/']);
        return;
      }
      this.applyCompanyData(id);
    });
  }

  private applyCompanyData(id: string): void {
    const data = this.companyData[id];
    this.company = data.company;
    this.services = data.services;
    this.contact = data.contact;
    this.schedule = data.schedule;
    this.reviews = data.reviews;
    this.heroImages = data.heroImages;
  }

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

  getSocialIcon(link: SocialLink): string {
    switch (link.type) {
      case 'whatsapp':
        return '/whatsapp.jpeg';
      case 'instagram':
        return '/instagram.png';
      case 'facebook':
        return '/facebook.png';
      default:
        return '/favicon.ico';
    }
  }
}
