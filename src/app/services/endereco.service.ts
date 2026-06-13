import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endereco } from '../models/endereco.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  private baseUrl = 'http://localhost:8080/enderecos';

  constructor(private http: HttpClient) {}

  listarDoUsuario(idUsuario: number): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`${this.baseUrl}/usuario/${idUsuario}`);
  }

  criar(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(this.baseUrl, endereco);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}