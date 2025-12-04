import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

type Perfil = 'usuario' | 'empresa';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string, perfil: Perfil): Observable<TokenResponse> {
    const clientId: 'usuario' | 'negocio' = perfil === 'empresa' ? 'negocio' : 'usuario';
    return this.solicitarToken(email, senha, clientId).pipe(
      tap((resposta) => this.salvarSessao(resposta.access_token))
    );
  }

  registrarConsumidor(dados: { nome: string; email: string; telefone: string; senha: string }) {
    return this.http.post<{ id: number }>(`${this.baseUrl}/usuarios`, dados);
  }

  registrarEmpresa(dados: { nome: string; email: string; telefone: string; senha: string }) {
    return this.http.post<{ id: number }>(`${this.baseUrl}/usuarios`, dados);
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  limparSessao(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
  }

  obterPerfil(): Perfil | null {
    const perfil = localStorage.getItem('perfil');
    if (perfil === 'usuario' || perfil === 'empresa') {
      return perfil;
    }
    return null;
  }

  obterPerfilDoToken(): Perfil | null {
    const token = this.obterToken();
    if (!token) return null;
    try {
      const payload = this.decodificarJwt(token);
      if (payload?.tipo === 'negocio') return 'empresa';
      if (payload?.tipo === 'usuario') return 'usuario';
      return null;
    } catch (error) {
      console.error('Não foi possível ler o token', error);
      return null;
    }
  }

  obterUsuarioId(): number | null {
    const token = this.obterToken();
    if (!token) return null;

    try {
      const payload = this.decodificarJwt(token);
      if (payload?.tipo === 'negocio') return null;
      const sub = Number(payload?.sub);
      return Number.isFinite(sub) ? sub : null;
    } catch (error) {
      console.error('Não foi possível ler o token', error);
      return null;
    }
  }

  obterNegocioId(): number | null {
    const token = this.obterToken();
    if (!token) return null;
    try {
      const payload = this.decodificarJwt(token);
      if (payload?.tipo === 'negocio') {
        const sub = Number(payload.sub);
        return Number.isFinite(sub) ? sub : null;
      }
      return null;
    } catch (error) {
      console.error('Não foi possível ler o token', error);
      return null;
    }
  }

  private solicitarToken(email: string, senha: string, clientId: 'usuario' | 'negocio') {
    const corpo = new HttpParams().set('username', email).set('password', senha).set('client_id', clientId);

    return this.http.post<TokenResponse>(`${this.baseUrl}/auth/token`, corpo.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    });
  }

  private salvarSessao(token: string): void {
    const payload = this.decodificarJwt(token);
    const perfil: Perfil = payload?.tipo === 'negocio' ? 'empresa' : 'usuario';
    localStorage.setItem('token', token);
    localStorage.setItem('perfil', perfil);
  }

  private decodificarJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
