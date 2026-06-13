import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  dados: any = null;
  carregando = false;
  mensagemErro = '';

  secaoAberta = '';
  lista: any[] = [];

  modalAberto = false;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.dashboardService.carregarIndicadores().subscribe({
      next: (data) => {
        this.dados = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar dashboard.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirPedidos(tipo = 'todos'): void {
    this.secaoAberta = `pedidos-${tipo}`;
    this.modalAberto = true;
    this.lista = [];

    this.dashboardService.listarPedidos().subscribe({
      next: (pedidos) => {
        if (tipo === 'pagos') {
          this.lista = pedidos.filter(p => p.status === 'PAGO');
        } else if (tipo === 'pendentes') {
          this.lista = pedidos.filter(p => p.status === 'PAGAMENTO_PENDENTE');
        } else if (tipo === 'cancelados') {
          this.lista = pedidos.filter(p => p.status === 'CANCELADO');
        } else {
          this.lista = pedidos;
        }

        this.cdr.detectChanges();
      },
      error: () => alert('Erro ao listar pedidos.')
    });
  }

  abrirUsuarios(): void {
    this.secaoAberta = 'usuarios';
    this.modalAberto = true;
    this.lista = [];

    this.dashboardService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.lista = usuarios;
        this.cdr.detectChanges();
      },
      error: () => alert('Erro ao listar usuários.')
    });
  }

  abrirEstoque(tipo: 'com' | 'sem'): void {
    this.secaoAberta = tipo === 'com' ? 'estoque-com' : 'estoque-sem';
    this.modalAberto = true;
    this.lista = [];

    this.dashboardService.listarProdutos().subscribe({
      next: (produtos) => {
        this.lista = tipo === 'com'
          ? produtos.filter(p => p.quantidadeEstoque > 0)
          : produtos.filter(p => !p.quantidadeEstoque || p.quantidadeEstoque <= 0);

        this.cdr.detectChanges();
      },
      error: () => alert('Erro ao listar estoque.')
    });
  }

  fecharLista(): void {
  this.secaoAberta = '';
  this.lista = [];
  this.modalAberto = false;
}

promoverParaAdm(usuario: any): void {
  if (!confirm(`Deseja transformar ${usuario.nome} em administrador?`)) {
    return;
  }

  this.dashboardService.promoverParaAdm(usuario.id).subscribe({
    next: () => {
      alert('Usuário promovido para ADM com sucesso!');
      this.abrirUsuarios();
      this.carregar();
    },
    error: (err) => {
      console.error(err);
      alert(
        err.error?.message ||
        err.error?.detail ||
        'Erro ao promover usuário.'
      );
    }
  });
}


}