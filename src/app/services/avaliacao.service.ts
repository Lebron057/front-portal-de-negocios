import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface AvaliacaoApi {
  id: number;
  nota: number;
  titulo: string;
  comentario: string;
  data: string;
  usuario_id: number;
  negocio_id: number;
  usuario?: { nome?: string };
}

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  private readonly baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  listarPorUsuario(usuarioId: number) {
    const params = new HttpParams().set('usuario_id', usuarioId);
    return this.http.get<AvaliacaoApi[]>(`${this.baseUrl}/avaliacoes`, { params });
  }

  listarPorNegocio(negocioId: number) {
    const params = new HttpParams().set('negocio_id', negocioId);
    return this.http.get<AvaliacaoApi[]>(`${this.baseUrl}/avaliacoes`, { params });
  }

  criarAvaliacao(payload: {
    nota: number;
    titulo: string;
    comentario: string;
    data: string;
    usuario_id: number;
    negocio_id: number;
  }) {
    return this.http.post<AvaliacaoApi>(`${this.baseUrl}/avaliacoes`, payload);
  }
}
