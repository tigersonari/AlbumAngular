import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Faixa } from '../models/faixa.model';

@Injectable({
  providedIn: 'root'
})
export class FaixaService {

  private baseUrl = 'http://localhost:8080/faixas';

  constructor(private http: HttpClient) {}

  findAll(page = 0, pageSize = 10): Observable<Faixa[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<Faixa[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findByTitulo(titulo: string): Observable<Faixa[]> {
    return this.http.get<Faixa[]>(`${this.baseUrl}/titulo/${encodeURIComponent(titulo)}`);
  }

  findById(id: number): Observable<Faixa> {
    return this.http.get<Faixa>(`${this.baseUrl}/${id}`);
  }

  findByAlbum(idAlbum: number): Observable<Faixa[]> {
    return this.http.get<Faixa[]>(`${this.baseUrl}/album/${idAlbum}`);
  }

  create(f: any): Observable<Faixa> {
    return this.http.post<Faixa>(this.baseUrl, f);
  }

  update(f: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${f.id}`, f);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}