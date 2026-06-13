import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PedidoResponse } from '../models/pedido-backend.model';
import { Observable } from 'rxjs';

export interface PagamentoResponse {
  id: number;
  metodoPagamento: string;
  status: string;
  valor: number;
  codigoPagamento: string;
  dataCriacao: string;
  ultimos4?: string;
  bandeira?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private baseUrl = 'http://localhost:8080/pagamentos';

  constructor(private http: HttpClient) {}

  buscarPorId(id: number): Observable<PagamentoResponse> {
    return this.http.get<PagamentoResponse>(`${this.baseUrl}/${id}`);
  }

  gerarPix(idPedido: number): Observable<PagamentoResponse> {
    return this.http.post<PagamentoResponse>(`${this.baseUrl}/pix/${idPedido}`, {});
  }
}