import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PedidoRequest, PedidoResponse } from '../models/pedido-backend.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoBackendService {

  private baseUrl = 'http://localhost:8080/pedidos';

  constructor(private http: HttpClient) {}

  criar(pedido: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(this.baseUrl, pedido);
  }

  listarPorUsuario(idUsuario: number): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.baseUrl}/usuario/${idUsuario}`);
  }

  buscarPorId(id: number): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.baseUrl}/${id}`);
  }

  cancelar(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/cancelar`, {});
  }
}