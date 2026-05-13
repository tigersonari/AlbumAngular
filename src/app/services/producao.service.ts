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

  findAll(page?: number, pageSize?: number): Observable<any[]> {
    let params = new HttpParams();

    if (page !== undefined && pageSize !== undefined) {
      params = params
        .set('page', page)
        .set('pageSize', pageSize);
    }

    return this.http.get<any[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(p: any) {
    return this.http.post(this.baseUrl, p);
  }

  update(p: any) {
    return this.http.put(`${this.baseUrl}/${p.id}`, p);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}