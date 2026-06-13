import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioLogado } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth';
  private storageKey = 'usuarioLogado';

  constructor(private http: HttpClient) {}

  login(dados: { login: string; senha: string }): Observable<UsuarioLogado> {
    return this.http.post<UsuarioLogado>(this.baseUrl, dados);
  }

  salvarUsuario(usuario: UsuarioLogado): void {
    localStorage.setItem(this.storageKey, JSON.stringify(usuario));
    localStorage.setItem('token', usuario.token);
  }

  getUsuario(): UsuarioLogado | null {
    const dados = localStorage.getItem(this.storageKey);
    return dados ? JSON.parse(dados) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogado(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUsuario()?.perfil === 'ADM';
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('token');
  }

  cadastrar(dados: {
  nome: string;
  login: string;
  senha: string;
  email: string;
  telefone: string;
}) {
  return this.http.post('http://localhost:8080/usuarios/cadastro', dados);
}
}