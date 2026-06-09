import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private baseUrl = 'http://localhost:8080/empresas';

  constructor(private http: HttpClient) {}

  findAll(page = 0, pageSize = 10): Observable<Empresa[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<Empresa[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findByNome(nome: string): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.baseUrl}/find/nome/${encodeURIComponent(nome)}`);
  }

  findById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.baseUrl}/${id}`);
  }

  create(e: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.baseUrl, e);
  }

  update(e: Empresa): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${e.id}`, e);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}