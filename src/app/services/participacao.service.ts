import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participacao } from '../models/participacao.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipacaoService {

  private baseUrl = 'http://localhost:8080/participacoes';

  constructor(private http: HttpClient) {}

  findAll(page: number, pageSize: number): Observable<Participacao[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<Participacao[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<Participacao> {
    return this.http.get<Participacao>(`${this.baseUrl}/${id}`);
  }

  create(p: Participacao) {
    return this.http.post(this.baseUrl, p);
  }

  update(p: Participacao) {
    return this.http.put(`${this.baseUrl}/${p.id}`, p);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}