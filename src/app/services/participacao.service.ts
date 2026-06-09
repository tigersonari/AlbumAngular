import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participacao } from '../models/participacao.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipacaoService {

  private baseUrl = 'http://localhost:8080/participacoes';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Participacao[]> {
    return this.http.get<Participacao[]>(this.baseUrl);
  }

  findByPapel(papel: string): Observable<Participacao[]> {
    return this.http.get<Participacao[]>(`${this.baseUrl}/papel/${encodeURIComponent(papel)}`);
  }

  findById(id: number): Observable<Participacao> {
    return this.http.get<Participacao>(`${this.baseUrl}/${id}`);
  }

  create(p: any): Observable<Participacao> {
    return this.http.post<Participacao>(this.baseUrl, p);
  }

  update(p: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${p.id}`, p);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}