import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface NegocioApi {
  id: number;
  nome_estabelecimento: string;
  nome_dono?: string;
  descricao?: string;
  email?: string;
  cnpj?: string;
  telefone?: string;
  whatsapp?: string;
  url_instagram?: string;
  url_site?: string;
  categoria?: { nome: string } | null;
  categorias?: { id: number; nome: string }[];
  endereco?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  } | null;
  horarios?: {
    dia_semana: string;
    horario_abre: string;
    horario_fecha: string;
    aberto: boolean;
  }[];
  fotos?: { url: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class NegocioApiService {
  readonly baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient, private authService: AuthService) {}

  listarNegocios(filtros?: { usuarioId?: number; negocioId?: number }): Observable<NegocioApi[]> {
    let params = new HttpParams();
    if (filtros?.usuarioId) {
      params = params.set('usuario_id', filtros.usuarioId);
    }
    if (filtros?.negocioId) {
      params = params.set('negocio_id', filtros.negocioId);
    }
    const headers = this.buildAuthHeaders();
    return this.http.get<NegocioApi[]>(`${this.baseUrl}/negocios`, { params, headers });
  }

  obterNegocio(id: number) {
    return this.http.get<NegocioApi>(`${this.baseUrl}/negocios/${id}`);
  }

  criarEndereco(payload: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  }) {
    const headers = this.buildAuthHeaders();
    return this.http.post<{ id: number }>(`${this.baseUrl}/enderecos`, payload, { headers });
  }

  listarCategorias() {
    const headers = this.buildAuthHeaders();
    return this.http.get<{ id: number; nome: string }[]>(`${this.baseUrl}/categorias`, { headers });
  }

  criarCategoria(nome: string) {
    const headers = this.buildAuthHeaders();
    return this.http.post<{ id: number; nome: string }>(`${this.baseUrl}/categorias`, { nome }, { headers });
  }

  criarNegocio(payload: {
    nome_dono: string;
    email: string;
    cnpj: string;
    nome_estabelecimento: string;
    descricao?: string;
    faixa_preco: number;
    telefone: string;
    whatsapp: string;
    url_instagram?: string;
    url_site?: string;
    usuario_id: number;
    endereco_id: number;
    categoria_id?: number;
    categoria_ids?: number[];
    categoria_nomes?: string[];
    senha: string;
  }) {
    const headers = this.buildAuthHeaders();
    return this.http.post<NegocioApi>(`${this.baseUrl}/negocios`, payload, { headers });
  }

  enviarFotos(negocioId: number, arquivos: File[]) {
    const formData = new FormData();
    arquivos.forEach((file) => formData.append('arquivos', file));
    const headers = this.buildAuthHeaders();
    return this.http.post(`${this.baseUrl}/negocios/${negocioId}/fotos`, formData, { headers });
  }

  criarHorario(payload: {
    dia_semana: string;
    horario_abre: string;
    horario_fecha: string;
    aberto: boolean;
    negocio_id: number;
  }) {
    const headers = this.buildAuthHeaders();
    return this.http.post(`${this.baseUrl}/horarios`, payload, { headers });
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.authService.obterToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }
}
