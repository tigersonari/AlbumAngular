import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producao } from '../models/producao.model';

@Injectable({
  providedIn: 'root'
})
export class ProducaoService {

  private baseUrl = 'http://localhost:8080/producoes';

  constructor(private http: HttpClient) {}

  findAll(page = 0, pageSize = 10): Observable<Producao[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<Producao[]>(this.baseUrl, { params });
  }

  findByProdutor(nome: string): Observable<Producao[]> {
    return this.http.get<Producao[]>(
      `${this.baseUrl}/find/produtor/${encodeURIComponent(nome)}`
    );
  }

  findById(id: number): Observable<Producao> {
    return this.http.get<Producao>(`${this.baseUrl}/${id}`);
  }

  create(p: any): Observable<Producao> {
    return this.http.post<Producao>(this.baseUrl, p);
  }

  update(p: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${p.id}`, p);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}