import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from '../models/album.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private baseUrl = 'http://localhost:8080/albums';

  constructor(private http: HttpClient) {}

  findAll(page = 0, pageSize = 10): Observable<Album[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Album[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findByTitulo(titulo: string, page = 0, pageSize = 10): Observable<Album[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Album[]>(
      `${this.baseUrl}/find/titulo/${encodeURIComponent(titulo)}`,
      { params }
    );
  }

  findById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.baseUrl}/${id}`);
  }

  create(album: any): Observable<Album> {
    return this.http.post<Album>(this.baseUrl, album);
  }

  update(album: any): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${album.id}`, album);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}