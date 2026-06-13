import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FaixaService } from '../../../services/faixa.service';
import { Faixa } from '../../../models/faixa.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faixa-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './faixa-list.html',
  styleUrls: ['./faixa-list.css']
})
export class FaixaListComponent implements OnInit {

  faixas: Faixa[] = [];
  filtro = '';

  page = 0;
  pageSize = 10;
  total = 0;

  carregando = false;
  mensagemErro = '';

  constructor(
    private service: FaixaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.service.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.faixas = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar faixas.';
        this.carregando = false;
      }
    });

    this.service.count().subscribe({
      next: (c) => this.total = c,
      error: () => this.total = 0
    });
  }

  pesquisar(): void {
    const termo = this.filtro.trim();

    if (!termo) {
      this.page = 0;
      this.loadData();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.service.findByTitulo(termo).subscribe({
      next: (data) => {
        this.faixas = data;
        this.page = 0;
        this.total = data.length;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao pesquisar faixa.';
        this.carregando = false;
      }
    });
  }

  excluir(id: number): void {
    if (!confirm('Deseja excluir esta faixa?')) return;

    this.service.delete(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => this.mensagemErro = 'Erro ao excluir faixa.'
    });
  }

  novo(): void {
    this.router.navigate(['/faixas/new']);
  }

  proxima(): void {
    if ((this.page + 1) * this.pageSize >= this.total) return;
    this.page++;
    this.loadData();
  }

  anterior(): void {
    if (this.page > 0) {
      this.page--;
      this.loadData();
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  getTipoVersao(tipo: any): string {
  if (!tipo) return '';

  if (typeof tipo === 'string') {
    return tipo;
  }

  return tipo.label || tipo.nome || tipo.name || tipo.descricao || tipo.toString?.() || '';
}
}