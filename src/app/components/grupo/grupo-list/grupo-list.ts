import { Component, OnInit } from '@angular/core';
import { GrupoService } from '../../../services/grupo.service';
import { EmpresaService } from '../../../services/empresa.service';
import { ArtistaService } from '../../../services/artista.service';

import { Grupo } from '../../../models/grupo.model';
import { Empresa } from '../../../models/empresa.model';
import { Artista } from '../../../models/artista.model';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { ProjetoMusicalService } from '../../../services/projetomusical.service';


@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './grupo-list.html',
  styleUrls: ['./grupo-list.css']
})
export class GrupoListComponent implements OnInit {

    page = 0;
    pageSize = 10;
    total = 0;

  grupos: Grupo[] = [];
  

  constructor(private service: GrupoService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
  this.service.findAll(this.page, this.pageSize)
    .subscribe(data => this.grupos = data);

  this.service.count()
    .subscribe(c => this.total = c);
}

getNomesMembros(membros: any[]): string {
  return membros?.map(m => m.nomeArtistico).join(', ') || '';
}

  deletar(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  novo() {
    this.router.navigate(['/grupos/new']);
  }
}