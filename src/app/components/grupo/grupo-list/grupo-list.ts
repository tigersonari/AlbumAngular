import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GrupoService } from '../../../services/grupo.service';
import { Grupo } from '../../../models/grupo.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './grupo-list.html',
  styleUrls: ['./grupo-list.css']
})
export class GrupoListComponent implements OnInit {

  page = 0;
  pageSize = 10;
  total = 0;

  grupos: Grupo[] = [];
  filtro = '';

  carregando = false;
  mensagemErro = '';

  constructor(
    private service: GrupoService,
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
        this.grupos = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar grupos musicais.';
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

    this.service.findByNome(termo).subscribe({
      next: (data) => {
        this.grupos = data;
        this.page = 0;
        this.total = data.length;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao pesquisar grupo.';
        this.carregando = false;
      }
    });
  }

  getNomesMembros(membros: any[]): string {
    return membros?.map(m => m.nomeArtistico).join(', ') || 'Sem integrantes';
  }

  deletar(id: number): void {
    if (!confirm('Deseja realmente excluir este grupo musical?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: () => this.mensagemErro = 'Erro ao excluir grupo.'
    });
  }

  novo(): void {
    this.router.navigate(['/grupos/new']);
  }

  proxima(): void {
    if ((this.page + 1) * this.pageSize >= this.total) {
      return;
    }

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
}