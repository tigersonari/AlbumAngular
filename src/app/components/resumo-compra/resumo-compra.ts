import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PagamentoService } from '../../services/pagamento.service';

@Component({
  selector: 'app-resumo-compra',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resumo-compra.html',
  styleUrls: ['./resumo-compra.css']
})
export class ResumoCompraComponent implements OnInit {

  pedido: any = null;

  constructor(private pagamentoService: PagamentoService) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

    const dados = localStorage.getItem(`ultimoPedido_${usuario.id}`);

    if (dados) {
      this.pedido = JSON.parse(dados);
    }
  }

  isPixSemCodigo(): boolean {
    return this.pedido?.pagamento?.metodoPagamento === 'PIX'
      && this.pedido?.pagamento?.status === 'PENDENTE'
      && !this.pedido?.pagamento?.codigoPagamento;
  }

  gerarPix(): void {
    if (!this.pedido?.id) return;

    this.pagamentoService.gerarPix(this.pedido.id).subscribe({
      next: (pagamento) => {
        this.pedido.pagamento = pagamento;

        const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

        localStorage.setItem(
          `ultimoPedido_${usuario.id}`,
          JSON.stringify(this.pedido)
        );

        alert('PIX gerado com sucesso!');
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao gerar PIX.');
      }
    });
  }
}