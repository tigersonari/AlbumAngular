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

  findAll(page: number, pageSize: number): Observable<Album[]> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<Album[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findByTitulo(titulo: string) {
    return this.http.get<Album[]>(`${this.baseUrl}/find/titulo/${titulo}`);
  }

  findById(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.baseUrl}/${id}`);
  }

  create(album: Album) {
    return this.http.post(this.baseUrl, album);
  }

  update(album: Album) {
    return this.http.put(`${this.baseUrl}/${album.id}`, album);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}