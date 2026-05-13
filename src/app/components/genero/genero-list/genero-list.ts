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

  constructor(
    private service: GeneroService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.loadData();
}

  loadData() {
  this.service.findAll(this.page, this.pageSize)
    .subscribe(data => this.generos = data);

  this.service.count()
    .subscribe(c => this.total = c);
}

  pesquisar() {
    if (!this.filtro) return this.loadData();

    this.service.findByNome(this.filtro)
      .subscribe(data => this.generos = data);
  }

  deletar(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  novo() {
    this.router.navigate(['/generos/new']);
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

/*page = 0;
pageSize = 10;
total = 0;

loadData() {
  this.service.findAll(this.page, this.pageSize)
    .subscribe(data => this.generos = data);

  this.service.count()
    .subscribe(c => this.total = c);
}

proximaPagina() {
  this.page++;
  this.loadData();
}

paginaAnterior() {
  if (this.page > 0) {
    this.page--;
    this.loadData();
  }
}*/