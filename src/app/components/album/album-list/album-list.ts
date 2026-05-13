import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../services/album.service';
import { ProducaoService } from '../../../services/producao.service';
import { ProjetoMusicalService } from '../../../services/projetomusical.service';

import { Album } from '../../../models/album.model';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FaixaService } from '../../../services/faixa.service';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './album-list.html',
  styleUrls: ['./album-list.css']
})
export class AlbumListComponent implements OnInit {

  albuns: Album[] = [];
  producoes: any[] = [];
  projetos: any[] = [];
  faixas: any[] = [];
  generos: any[] = [];
  faixasPorAlbum: { [key: number]: any[] } = {};

  filtro = '';

  page = 0;
  pageSize = 10;
  total = 0;

  constructor(
    private service: AlbumService,
    private producaoService: ProducaoService,
    private projetoService: ProjetoMusicalService,
    private faixaService: FaixaService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.producaoService.findAll(0, 100)
      .subscribe(p => this.producoes = p);

    this.projetoService.findAll(0, 100)
      .subscribe(p => this.projetos = p);
  }

  loadData() {
  this.service.findAll(this.page, this.pageSize)
    .subscribe(data => {
      this.albuns = data;

      
      this.albuns.forEach(a => {
        this.loadFaixas(a.id);
      });
    });

  this.service.count()
    .subscribe(c => this.total = c);
}

  /*load de todas as faixas do album (tirar dúvida com professor depois)*/ 
  loadFaixas(albumId: number) {
  this.faixaService.findByAlbum(albumId)
    .subscribe(f => this.faixasPorAlbum[albumId] = f);
}

  pesquisar() {
    if (!this.filtro) return this.loadData();

    this.service.findByTitulo(this.filtro)
      .subscribe(data => this.albuns = data);
  }

  excluir(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  getNomeProducao(id: number): string {
    return this.producoes.find(p => p.id === id)?.produtor || '';
  }

  getProjetos(ids: number[]): string {
    return ids?.map(id => `Projeto ${id}`).join(', ') || '';
  }

  /*pegar genero das faixas*/
  getGenerosDoAlbum(albumId: number): string {

  const faixas = this.faixasPorAlbum[albumId] || [];

  const nomes = faixas.map(f => f.nomeGenero);

  return [...new Set(nomes)].join(', ');
}

}