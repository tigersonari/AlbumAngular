import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartaoSalvo, NovoCartao } from '../models/cartao.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {

  private baseUrl = 'http://localhost:8080/cartoes';

  constructor(private http: HttpClient) {}

  listar(): Observable<CartaoSalvo[]> {
    return this.http.get<CartaoSalvo[]>(this.baseUrl);
  }

  criar(cartao: NovoCartao): Observable<CartaoSalvo> {
    return this.http.post<CartaoSalvo>(this.baseUrl, cartao);
  }

  buscar(id: number): Observable<CartaoSalvo> {
    return this.http.get<CartaoSalvo>(`${this.baseUrl}/${id}`);
  }
}