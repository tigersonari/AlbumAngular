import { Component, OnInit } from '@angular/core';
import { ParticipacaoService } from '../../../services/participacao.service';
import { ArtistaService } from '../../../services/artista.service';
import { GrupoService } from '../../../services/grupo.service';

import { Participacao } from '../../../models/participacao.model';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-participacao-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './participacao-list.html',
  styleUrls: ['./participacao-list.css']
})
export class ParticipacaoListComponent implements OnInit {

  participacoes: Participacao[] = [];

  artistas: any[] = [];
  grupos: any[] = [];

  page = 0;
  pageSize = 10;
  total = 0;

  constructor(
    private service: ParticipacaoService,
    private artistaService: ArtistaService,
    private grupoService: GrupoService
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
      .subscribe(data => this.participacoes = data);

    this.service.count()
      .subscribe(c => this.total = c);
  }

  next() {
    this.page++;
    this.loadData();
  }

  prev() {
    if (this.page > 0) {
      this.page--;
      this.loadData();
    }
  }

  excluir(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  //  pegar nome do artista/grupo
  getNomeProjeto(id: number): string {

    const artista = this.artistas.find(a => a.id === id);
    if (artista) return artista.nomeArtistico;

    const grupo = this.grupos.find(g => g.id === id);
    if (grupo) return grupo.nomeGrupo;

    return '';
  }

  //  mostrar nomes (não IDs)
  getProjetos(ids: number[]): string {
    return ids
      ?.map(id => this.getNomeProjeto(id))
      .join(', ');
  }
}