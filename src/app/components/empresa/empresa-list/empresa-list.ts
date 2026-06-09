import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-empresa-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './empresa-list.html',
  styleUrls: ['./empresa-list.css']
})
export class EmpresaListComponent implements OnInit {

  filtro = '';
  empresas: Empresa[] = [];

  page = 0;
  pageSize = 10;
  total = 0;

  carregando = false;
  mensagemErro = '';

  constructor(
    private service: EmpresaService, 
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
        this.empresas = data;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar as empresas.';
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
        this.empresas = data;
        this.page = 0;
        this.total = data.length;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao pesquisar empresa.';
        this.carregando = false;
      }
    });
  }

  deletar(id: number): void {
    if (!confirm('Deseja realmente excluir esta empresa?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => this.loadData(),
      error: () => this.mensagemErro = 'Erro ao excluir empresa.'
    });
  }

  novo(): void {
    this.router.navigate(['/empresas/new']);
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