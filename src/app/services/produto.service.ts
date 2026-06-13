import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from '../models/produto.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private baseUrl = 'http://localhost:8080/produtos';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.baseUrl);
  }

  findById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/${id}`);
  }

  findByAlbum(idAlbum: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/album/${idAlbum}`);
  }

  create(produto: {
  idAlbum: number;
  preco: number;
  quantidadeEstoque: number;
}) {
  return this.http.post<Produto>(this.baseUrl, produto);
}

update(produto: {
  id: number;
  idAlbum: number;
  preco: number;
  quantidadeEstoque: number;
}) {
  return this.http.put<void>(`${this.baseUrl}/${produto.id}`, produto);
}
}