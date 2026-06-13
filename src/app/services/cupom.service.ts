import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CupomResponse {
  codigo: string;
  percentualDesconto: number;
  valorDesconto: number;
  totalComDesconto: number;
  mensagem: string;
}

@Injectable({
  providedIn: 'root'
})
export class CupomService {

  private baseUrl = 'http://localhost:8080/cupons';

  constructor(private http: HttpClient) {}

  validar(codigo: string, total: number): Observable<CupomResponse> {
    return this.http.post<CupomResponse>(`${this.baseUrl}/validar`, {
      codigo,
      total
    });
  }
}