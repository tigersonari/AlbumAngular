import { Component, OnInit } from '@angular/core';
import { ComposicaoService } from '../../../services/composicao.service';
import { ArtistaService } from '../../../services/artista.service';
import { GrupoService } from '../../../services/grupo.service';

import { Composicao } from '../../../models/composicao.model';
import { Artista } from '../../../models/artista.model';
import { Grupo } from '../../../models/grupo.model';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-composicao-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './composicao-list.html',
  styleUrls: ['./composicao-list.css']
})
export class ComposicaoListComponent implements OnInit {

  composicoes: Composicao[] = [];
  artistas: Artista[] = [];
  grupos: Grupo[] = [];

  page = 0;
  pageSize = 10;
  total = 0;

  constructor(
    private service: ComposicaoService,
    private artistaService: ArtistaService,
    private grupoService: GrupoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.artistaService.findAll(0, 100)
      .subscribe(a => this.artistas = a);

    this.grupoService.findAll(0, 100)
      .subscribe(g => this.grupos = g);
  }

  loadData() {
  this.service.findAll(this.page, this.pageSize)
    .subscribe({
      next: data => this.composicoes = data,
      error: () => alert('Erro ao carregar composições')
    });

  this.service.count()
    .subscribe({
      next: c => this.total = c,
      error: () => alert('Erro ao contar composições')
    });
}

getProjetos(c: any): string {
  return c.projetos
    ?.map((p: any) => p.nomeArtistico || p.nomeGrupo)
    .join(', ') || '';
}

excluir(id: number) {
  if (!confirm('Deseja excluir?')) return;

  this.service.delete(id).subscribe({
    next: () => {
      alert('Excluído com sucesso!');
      this.loadData();
    },
    error: () => alert('Erro ao excluir')
  });
}


novo() {
    this.router.navigate(['/composicoes/new']);
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