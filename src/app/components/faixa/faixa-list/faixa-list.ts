import { Component, OnInit } from '@angular/core';
import { FaixaService } from '../../../services/faixa.service';
import { AlbumService } from '../../../services/album.service';
import { GeneroService } from '../../../services/genero.service';

import { Faixa } from '../../../models/faixa.model';
import { Album } from '../../../models/album.model';
import { Genero } from '../../../models/genero.model';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faixa-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faixa-list.html',
  styleUrls: ['./faixa-list.css']
})
export class FaixaListComponent implements OnInit {

  faixas: Faixa[] = [];
  albuns: Album[] = [];
  generos: Genero[] = [];

  page = 0;
  pageSize = 10;
  total = 0;

  constructor(
    private service: FaixaService,
    private albumService: AlbumService,
    private generoService: GeneroService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.albumService.findAll(0, 100).subscribe(a => this.albuns = a);
    this.generoService.findAll().subscribe(g => this.generos = g);
  }

  loadData() {
    this.service.findAll(this.page, this.pageSize)
      .subscribe(data => this.faixas = data);

    this.service.count()
      .subscribe(c => this.total = c);
  }

  excluir(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  getNomeAlbum(id: number) {
    return this.albuns.find(a => a.id === id)?.titulo || '';
  }

  getNomeGenero(id: number) {
    return this.generos.find(g => g.id === id)?.nomeGenero || '';
  }

  getTipoVersao(tipo: number) {
    const tipos = ['Original', 'Remix', 'Ao Vivo'];
    return tipos[tipo - 1] || '';
  }
}