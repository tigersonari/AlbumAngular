import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Genero } from '../models/genero.model';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private baseUrl = 'http://localhost:8080/generos';

  constructor(private http: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Genero[]> {
    let params = new HttpParams();

    if (page !== undefined && pageSize !== undefined) {
      params = params
        .set('page', page)
        .set('pageSize', pageSize);
    }

    return this.http.get<Genero[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findByNome(nome: string): Observable<Genero[]> {
    return this.http.get<Genero[]>(`${this.baseUrl}/find/nome/${nome}`);
  }

  findById(id: number): Observable<Genero> {
    return this.http.get<Genero>(`${this.baseUrl}/${id}`);
  }

  create(genero: Genero): Observable<Genero> {
    return this.http.post<Genero>(this.baseUrl, genero);
  }

  update(genero: Genero): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${genero.id}`, genero);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}