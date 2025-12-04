import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface UsuarioApi {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  obterUsuario(id: number) {
    return this.http.get<UsuarioApi>(`${this.baseUrl}/usuarios/${id}`);
  }
}
