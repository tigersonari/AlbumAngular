import { Component, OnInit } from '@angular/core';
import { ArtistaService } from '../../../services/artista.service';
import { EmpresaService } from '../../../services/empresa.service';
import { Artista } from '../../../models/artista.model';
import { Empresa } from '../../../models/empresa.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artista-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './artista-list.html',
  styleUrls: ['./artista-list.css']
})
export class ArtistaListComponent implements OnInit {

  page = 0;
  pageSize = 10;
  total = 0;

  artistas: Artista[] = [];
  empresas: Empresa[] = [];

  filtro = '';
  empresaFiltro: number | null = null;

  carregando = false;
  mensagemErro = '';

  constructor(
    private service: ArtistaService,
    private empresaService: EmpresaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.empresaService.findAll(0, 100).subscribe({
      next: (e) => this.empresas = e,
      error: () => this.mensagemErro = 'Erro ao carregar empresas.'
    });
  }

  loadData(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.service.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.artistas = data;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar artistas.';
        this.carregando = false;
      }
    });

    this.service.count().subscribe({
      next: (c) => this.total = c,
      error: () => this.total = 0
    });
  }

  buscarPorEmpresa(): void {
    if (!this.empresaFiltro) {
      this.page = 0;
      this.loadData();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.service.findByEmpresa(this.empresaFiltro).subscribe({
      next: (data) => {
        this.artistas = data;
        this.page = 0;
        this.total = data.length;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao filtrar por empresa.';
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

    this.service.findByNomeArtistico(termo).subscribe({
      next: (data) => {
        this.artistas = data;
        this.page = 0;
        this.total = data.length;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao pesquisar artista.';
        this.carregando = false;
      }
    });
  }

  deletar(id: number): void {
    if (!confirm('Deseja realmente excluir este artista?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => this.loadData(),
      error: () => this.mensagemErro = 'Erro ao excluir artista.'
    });
  }

  novo(): void {
    this.router.navigate(['/artistas/new']);
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