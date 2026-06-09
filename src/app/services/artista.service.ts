
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artista } from '../models/artista.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistaService {

  private baseUrl = 'http://localhost:8080/artistas';

  constructor(private http: HttpClient) {}

  findAll(page: number, pageSize: number): Observable<Artista[]> {
  const params = new HttpParams()
    .set('page', page)
    .set('pageSize', pageSize);

  return this.http.get<Artista[]>(this.baseUrl, { params });
}

count(): Observable<number> {
  return this.http.get<number>(`${this.baseUrl}/count`);
}

  findByNomeArtistico(nome: string): Observable<Artista[]> {
  return this.http.get<Artista[]>(
    `${this.baseUrl}/nome-artistico/${encodeURIComponent(nome)}`
  );
}

  findById(id: number): Observable<Artista> {
    return this.http.get<Artista>(`${this.baseUrl}/${id}`);
  }

  create(a: Artista): Observable<Artista> {
    return this.http.post<Artista>(this.baseUrl, a);
  }

  update(a: Artista): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${a.id}`, a);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  findByEmpresa(idEmpresa: number) {
  return this.http.get<Artista[]>(
    `${this.baseUrl}/empresa/${idEmpresa}`
  );

}

findByProjeto(idProjeto: number) {
  return this.http.get<Artista[]>(
    `${this.baseUrl}/find/projeto/${idProjeto}`
  );
}

}