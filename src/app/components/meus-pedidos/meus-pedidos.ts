import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PedidoBackendService } from '../../services/pedido-backend.service';
import { PedidoResponse } from '../../models/pedido-backend.model';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meus-pedidos.html',
  styleUrls: ['./meus-pedidos.css']
})
export class MeusPedidosComponent implements OnInit {

  pedidos: PedidoResponse[] = [];
  mensagemErro = '';
  carregando = false;

  constructor(
    private pedidoService: PedidoBackendService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  getIdUsuario(): number {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    return Number(usuario.id);
  }

  carregarPedidos(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.pedidoService.listarPorUsuario(this.getIdUsuario()).subscribe({
      next: (data) => {
        this.pedidos = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar pedidos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelarPedido(id: number): void {
    if (!confirm('Deseja cancelar este pedido?')) return;

    this.pedidoService.cancelar(id).subscribe({
      next: () => this.carregarPedidos(),
      error: () => this.mensagemErro = 'Erro ao cancelar pedido.'
    });
  }
}