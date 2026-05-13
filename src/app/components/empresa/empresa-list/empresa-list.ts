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

  constructor(
    private service: EmpresaService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.findAll(this.page, this.pageSize)
      .subscribe(data => this.empresas = data);

    this.service.count()
      .subscribe(c => this.total = c);
  }

  pesquisar() {
    if (!this.filtro) return this.loadData();

    this.service.findByNome(this.filtro)
      .subscribe(data => this.empresas = data);
  }

  deletar(id: number) {
    this.service.delete(id).subscribe(() => this.loadData());
  }

  novo() {
    this.router.navigate(['/empresas/new']);
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
