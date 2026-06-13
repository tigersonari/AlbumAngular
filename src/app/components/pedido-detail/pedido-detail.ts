import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PedidoBackendService } from '../../services/pedido-backend.service';
import { PedidoResponse } from '../../models/pedido-backend.model';
import { PagamentoService } from '../../services/pagamento.service';

@Component({
  selector: 'app-pedido-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pedido-detail.html',
  styleUrls: ['./pedido-detail.css']
})
export class PedidoDetailComponent implements OnInit {

  pedido?: PedidoResponse;
  carregando = false;
  mensagemErro = '';

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoBackendService,
    private pagamentoService: PagamentoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);

    if (id) {
      this.carregarPedido(id);
    }
  }

  carregarPedido(id: number): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.pedidoService.buscarPorId(id).subscribe({
      next: (data) => {
        this.pedido = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.mensagemErro = 'Erro ao carregar pedido.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  gerarPix(): void {
    if (!this.pedido) return;

    this.pagamentoService.gerarPix(this.pedido.id).subscribe({
      next: (pagamentoAtualizado) => {
        if (this.pedido) {
          this.pedido.pagamento = pagamentoAtualizado;
        }

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.mensagemErro = 'Erro ao gerar PIX.';
        this.cdr.detectChanges();
      }
    });
  }

  isPixSemCodigo(): boolean {
    return this.pedido?.pagamento?.metodoPagamento === 'PIX'
      && !this.pedido?.pagamento?.codigoPagamento;
  }

  isBoleto(): boolean {
    return this.pedido?.pagamento?.metodoPagamento === 'BOLETO';
  }

  isCartao(): boolean {
    return this.pedido?.pagamento?.metodoPagamento === 'CARTAO';
  }
}