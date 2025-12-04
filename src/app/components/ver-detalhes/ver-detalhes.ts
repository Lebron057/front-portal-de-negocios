import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NegocioApiService } from '../../services/negocio.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AvaliacaoService } from '../../services/avaliacao.service';

type SocialLinkType = 'whatsapp' | 'instagram' | 'facebook' | 'email';

interface SocialLink {
  type: SocialLinkType;
  label: string;
  href: string;
}

interface Company {
  name: string;
  category: string;
  categories: string[];
  rating: number;
  ratingCount: number;
  description: string;
  socials: SocialLink[];
  logoUrl?: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  phoneLink?: string;
  cnpj: string;
  site?: string;
  mapsUrl: string;
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
  imports: [Navbar, CommonModule, RouterModule, FormsModule],
  templateUrl: './ver-detalhes.html',
  styleUrls: ['./ver-detalhes.css'],
})
export class VerDetalhes implements OnInit {
  Math = Math;
  heroImages: string[] = [];
  company: Company | null = null;
  services: string[] = [];
  contact: ContactInfo | null = null;
  schedule: ScheduleItem[] = [];
  reviews: Review[] = [];
  carregando = true;
  erro = '';
  starRange = [1, 2, 3, 4, 5];
  podeComentar = false;
  novaAvaliacao = { nota: 5, titulo: '', comentario: '' };
  erroAvaliacao = '';
  sucessoAvaliacao = '';
  negocioId!: number;
  usuarioIdLogado: number | null = null;
  perfilLogado: string | null = null;
  negocioIdToken: number | null = null;
  mostrarFormulario = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private negocioService: NegocioApiService,
    private authService: AuthService,
    private avaliacaoService: AvaliacaoService,
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const negocioId = idParam ? Number(idParam) : NaN;
    if (Number.isNaN(negocioId)) {
      this.erro = 'Negócio não encontrado.';
      this.carregando = false;
      return;
    }
    this.negocioId = negocioId;

    this.negocioService.obterNegocio(negocioId).subscribe({
      next: (n) => {
        this.mapearNegocio(n);
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar negócio', erro);
        this.erro = 'Não foi possível carregar este negócio.';
        this.carregando = false;
      },
    });

    this.perfilLogado = this.authService.obterPerfilDoToken() || this.authService.obterPerfil();
    this.usuarioIdLogado = this.authService.obterUsuarioId();
    this.negocioIdToken = this.authService.obterNegocioId();
    const tokenExiste = !!this.authService.obterToken();
    const ehProprioNegocio = this.negocioIdToken && this.negocioIdToken === negocioId;
    this.podeComentar = tokenExiste && !ehProprioNegocio;
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

  private mapearNegocio(n: any) {
    const endereco = n.endereco;
    const socials: SocialLink[] = [];
    if (n.whatsapp) {
      const whatsappClean = n.whatsapp.replace(/\D/g, '');
      socials.push({ type: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/${whatsappClean}` });
    }
    if (n.url_instagram) {
      socials.push({ type: 'instagram', label: 'Instagram', href: n.url_instagram });
    }

    const ratingBruto = n.avaliacoes?.length ? this.calcularMedia(n.avaliacoes) : 0;
    const ratingClamped = this.clampRating(ratingBruto);

    this.company = {
      name: n.nome_estabelecimento || 'Negócio sem nome',
      category: n.categoria?.nome || 'Categoria não informada',
      categories: n.categorias?.length
        ? n.categorias.map((c: any) => c.nome)
        : n.categoria?.nome
          ? [n.categoria.nome]
          : ['Categoria não informada'],
      rating: ratingClamped,
      ratingCount: n.avaliacoes?.length || 0,
      description: n.descricao || 'Descrição não informada.',
      socials,
      logoUrl: n.fotos?.[0]?.url ? `${this.negocioService.baseUrl}${n.fotos[0].url}` : undefined,
    };

    this.services =
      this.company.categories.length && this.company.categories[0] !== 'Categoria não informada'
        ? this.company.categories
        : ['Serviços não informados'];

    const rua = endereco?.rua || 'Endereço não informado';
    const numero = endereco?.numero || 's/n';
    const bairro = endereco?.bairro ? ` - ${endereco.bairro}` : '';
    const cidade = endereco?.cidade ? ` - ${endereco.cidade}` : '';

    const waNumber = (n.whatsapp || n.telefone || '').replace(/\D/g, '');
    const phoneLink = waNumber ? `https://wa.me/${waNumber}` : undefined;

    this.contact = {
      address: `${rua}, ${numero}${bairro}${cidade}`,
      phone: n.telefone || n.whatsapp || 'Contato não informado',
      phoneLink,
      cnpj: n.cnpj || 'CNPJ não informado',
      site: n.url_site,
      mapsUrl: this.montarMapsUrl(`${rua}, ${numero}${bairro}${cidade}`),
    };

    this.schedule = this.ordenarHorarios(n.horarios || []);

    this.reviews = (n.avaliacoes || []).map((a: any) => ({
      userInitial: a.usuario?.nome?.[0]?.toUpperCase() || 'U',
      userName: a.usuario?.nome || 'Usuário',
      date: a.data || '',
      rating: a.nota || 0,
      text: a.comentario || '',
    }));

    this.heroImages = (n.fotos || []).map((f: any) => `${this.negocioService.baseUrl}${f.url}`);
  }

  enviarAvaliacao(): void {
    this.erroAvaliacao = '';
    this.sucessoAvaliacao = '';
    const usuarioId = this.usuarioIdLogado || this.authService.obterUsuarioId();
    const negocioIdToken = this.authService.obterNegocioId();
    if (negocioIdToken && negocioIdToken === this.negocioId) {
      this.erroAvaliacao = 'Você não pode avaliar o próprio negócio.';
      return;
    }
    if (!usuarioId && this.perfilLogado !== 'usuario') {
      this.erroAvaliacao = 'Faça login para comentar.';
      return;
    }
    const notaClamped = Math.min(5, Math.max(1, Number(this.novaAvaliacao.nota)));
    const payload = {
      nota: notaClamped,
      titulo: this.novaAvaliacao.titulo || 'Minha avaliação',
      comentario: this.novaAvaliacao.comentario || '',
      data: new Date().toISOString(),
      usuario_id: usuarioId || 0,
      negocio_id: this.negocioId,
    };
    this.avaliacaoService.criarAvaliacao(payload).subscribe({
      next: () => {
        this.sucessoAvaliacao = 'Avaliação enviada com sucesso!';
        this.reviews = [
          {
            userInitial: this.authService.obterPerfil() || 'U',
            userName: this.authService.obterPerfil() || 'Você',
            date: new Date().toLocaleString('pt-BR'),
            rating: notaClamped,
            text: payload.comentario,
          },
          ...this.reviews,
        ];
        this.novaAvaliacao = { nota: 5, titulo: '', comentario: '' };
      },
      error: (erro: any) => {
        console.error('Erro ao enviar avaliação', erro);
        this.erroAvaliacao = 'Não foi possível enviar sua avaliação.';
      },
    });
  }

  private calcularMedia(avaliacoes: any[]): number {
    if (!avaliacoes.length) return 0;
    const soma = avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0);
    return soma / avaliacoes.length;
  }

  clampRating(valor: number): number {
    const num = Number(valor) || 0;
    return Math.min(5, Math.max(0, num));
  }

  private ordenarHorarios(horarios: any[]): ScheduleItem[] {
    const ordem = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Sab', 'Dom'];
    const formatar = (valor: any) => {
      const str = (valor || '').toString();
      if (str.includes(':')) return str.slice(0, 5);
      return str;
    };

    return horarios
      .map((h: any) => ({
        day: h.dia_semana,
        hours: `${formatar(h.horario_abre)} - ${formatar(h.horario_fecha)}`,
      }))
      .sort((a, b) => ordem.indexOf(a.day) - ordem.indexOf(b.day));
  }

  private montarMapsUrl(endereco: string): string {
    const query = encodeURIComponent(endereco);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }

  getSocialClass(social: SocialLink): string {
    return `icone-${social.type}`;
  }

  getSocialIcon(social: SocialLink): string {
    switch (social.type) {
      case 'whatsapp':
        return '/whatsapp.jpeg';
      case 'instagram':
        return '/instagram.png';
      case 'facebook':
        return '/facebook_icon.svg';
      case 'email':
        return '/email_icon.svg';
      default:
        return '/link_icon.svg';
    }
  }
}
