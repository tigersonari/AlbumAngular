import { Component, OnInit } from '@angular/core';
import { ProducaoService } from '../../../services/producao.service';
import { Producao } from '../../../models/producao.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa.model';

@Component({
  selector: 'app-producao-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './producao-list.html',
  styleUrls: ['./producao-list.css']
})
export class ProducaoListComponent implements OnInit {

  producoes: any[] = [];
  page = 0;
  pageSize = 10;
  total = 0;

  constructor(
    private service: ProducaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.findAll(this.page, this.pageSize)
      .subscribe(data => this.producoes = data);

    this.service.count()
      .subscribe(c => this.total = c);
  }

  deletar(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  novo() {
    this.router.navigate(['/producoes/new']);
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