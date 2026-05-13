import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Grupo } from '../models/grupo.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private baseUrl = 'http://localhost:8080/grupos-musicais';

  constructor(private http: HttpClient) {}

  findAll(page: number, pageSize: number): Observable<Grupo[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<Grupo[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.baseUrl}/${id}`);
  }

  create(g: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(this.baseUrl, g);
  }

  update(g: Grupo): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${g.id}`, g);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}