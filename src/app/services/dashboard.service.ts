import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  private safeGet<T>(url: string, fallback: T): Observable<T> {
    return this.http.get<T>(url).pipe(catchError(() => of(fallback)));
  }

  carregarIndicadores(): Observable<any> {
    return forkJoin({
      albuns: this.safeGet<number>('http://localhost:8080/albums/count', 0),
      generos: this.safeGet<number>('http://localhost:8080/generos/count', 0),
      empresas: this.safeGet<number>('http://localhost:8080/empresas/count', 0),
      artistas: this.safeGet<number>('http://localhost:8080/artistas/count', 0),
      grupos: this.safeGet<number>('http://localhost:8080/grupos-musicais/count', 0),
      faixas: this.safeGet<number>('http://localhost:8080/faixas/count', 0),
      composicoes: this.safeGet<number>('http://localhost:8080/composicoes/count', 0),

      pedidos: this.safeGet<number>('http://localhost:8080/pedidos/count', 0),
      pedidosPagos: this.safeGet<number>('http://localhost:8080/pedidos/count/status/PAGO', 0),
      pedidosPendentes: this.safeGet<number>('http://localhost:8080/pedidos/count/status/PAGAMENTO_PENDENTE', 0),
      pedidosCancelados: this.safeGet<number>('http://localhost:8080/pedidos/count/status/CANCELADO', 0),
      faturamento: this.safeGet<number>('http://localhost:8080/pedidos/faturamento', 0),

      produtosLista: this.safeGet<any[]>('http://localhost:8080/produtos', [])
    }).pipe(
      map(data => {
        const produtos = data.produtosLista || [];

        return {
          ...data,
          albunsComEstoque: produtos.filter(p => p.quantidadeEstoque > 0).length,
          albunsSemEstoque: produtos.filter(p => !p.quantidadeEstoque || p.quantidadeEstoque <= 0).length
        };
      })
    );
  }

  listarPedidos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/pedidos');
  }

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/usuarios');
  }

  listarProdutos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/produtos');
  }

  promoverParaAdm(id: number) {
  return this.http.put<void>(
    `http://localhost:8080/usuarios/${id}/promover-adm`,
    {}
  );
}
}