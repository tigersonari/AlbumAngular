import { Component, OnInit } from '@angular/core';
import { ProducaoService } from '../../../services/producao.service';
import { Producao } from '../../../models/producao.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-producao-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './producao-list.html',
  styleUrls: ['./producao-list.css']
})
export class ProducaoListComponent implements OnInit {

  producoes: Producao[] = [];
  filtro = '';

  page = 0;
  pageSize = 10;

  carregando = false;
  mensagemErro = '';

  constructor(
    private service: ProducaoService,
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
        this.producoes = data;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar produções.';
        this.carregando = false;
      }
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

    this.service.findByProdutor(termo).subscribe({
      next: (data) => {
        this.producoes = data;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao pesquisar produção.';
        this.carregando = false;
      }
    });
  }

  deletar(id: number): void {
    if (!confirm('Deseja realmente excluir esta produção?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => this.loadData(),
      error: () => this.mensagemErro = 'Erro ao excluir produção.'
    });
  }

  novo(): void {
    this.router.navigate(['/producoes/new']);
  }

  proxima(): void {
    if (this.producoes.length < this.pageSize) {
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
}