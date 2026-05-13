import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjetoMusicalService {

  private api = 'http://localhost:8080/projetos-musicais';

  constructor(private http: HttpClient) {}

  findAll(page: number, pageSize: number) {
    return this.http.get<any[]>(`${this.api}?page=${page}&pageSize=${pageSize}`);
  }

  findById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }
}