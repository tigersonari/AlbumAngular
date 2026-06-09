import { Component, OnInit } from '@angular/core';
import { GeneroService } from '../../../services/genero.service';
import { Genero } from '../../../models/genero.model';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-genero-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './genero-list.html'
})
export class GeneroListComponent implements OnInit {

  generos: Genero[] = [];
  filtro = '';

  page = 0;
  pageSize = 10;
  total = 0;

  carregando = false;
  mensagemErro = '';

  constructor(
    private service: GeneroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.service.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.generos = data;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar os gêneros.';
        this.carregando = false;
      }
    });

    this.service.count().subscribe({
      next: (count) => this.total = count,
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
        this.generos = data;
        this.page = 0;
        this.total = data.length;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao pesquisar gênero.';
        this.carregando = false;
      }
    });
  }

  deletar(id: number): void {
    if (!confirm('Deseja realmente excluir este gênero?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => this.loadData(),
      error: () => this.mensagemErro = 'Erro ao excluir gênero.'
    });
  }

  novo(): void {
    this.router.navigate(['/generos/new']);
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