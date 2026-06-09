import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Composicao } from '../models/composicao.model';

@Injectable({
  providedIn: 'root'
})
export class ComposicaoService {

  private baseUrl = 'http://localhost:8080/composicoes';

  constructor(private http: HttpClient) {}

  findAll(page = 0, pageSize = 10): Observable<Composicao[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<Composicao[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<Composicao> {
    return this.http.get<Composicao>(`${this.baseUrl}/${id}`);
  }

  findByData(data: string): Observable<Composicao[]> {
  return this.http.get<Composicao[]>(`${this.baseUrl}/data/${data}`);
}

  create(c: any): Observable<Composicao> {
    return this.http.post<Composicao>(this.baseUrl, c);
  }

  update(c: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${c.id}`, c);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}