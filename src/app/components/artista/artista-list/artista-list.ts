import { Component, OnInit } from '@angular/core';
import { ArtistaService } from '../../../services/artista.service';
import { EmpresaService } from '../../../services/empresa.service';
import { Artista } from '../../../models/artista.model';
import { Empresa } from '../../../models/empresa.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjetoMusicalService } from '../../../services/projetomusical.service';


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

  projetos: any[] = [];
projetoFiltro: number | null = null;


  empresaFiltro: number | null = null;

  constructor(
    private service: ArtistaService,
    private empresaService: EmpresaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.empresaService.findAll(0, 100).subscribe(e => this.empresas = e);
  }

  loadData() {
  this.service.findAll(this.page, this.pageSize)
    .subscribe(data => this.artistas = data);

  this.service.count()
    .subscribe(c => this.total = c);
}

  buscarPorEmpresa() {
    if (!this.empresaFiltro) {
      this.loadData();
      return;
    } 

    this.service.findByEmpresa(this.empresaFiltro)
      .subscribe(data => this.artistas = data);
  }

  pesquisar() {
    if (!this.filtro) return this.loadData();

    this.service.findByNomeArtistico(this.filtro)
      .subscribe((data: Artista[]) => this.artistas = data);
  } 

  deletar(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  novo() {
    this.router.navigate(['/artistas/new']);
  }

 proxima() {
  this.page++;
  this.loadData();
}

anterior() {
  if (this.page > 0) {
    this.page--;
    this.loadData();
  }
}
}