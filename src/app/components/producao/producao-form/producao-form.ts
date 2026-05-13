import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProducaoService } from '../../../services/producao.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EmpresaService } from '../../../services/empresa.service';
import { Empresa } from '../../../models/empresa.model';

@Component({
  selector: 'app-producao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './producao-form.html',
  styleUrls: ['./producao-form.css']
})
export class ProducaoFormComponent implements OnInit {

  form: any;
  empresas: Empresa[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ProducaoService,
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      produtor: ['', Validators.required],
      engenheiroGravacao: [''],
      engenheiroMixagem: [''],
      engenheiroMasterizacao: [''],
      dataProducao: ['', Validators.required],
      idEmpresa: [null, Validators.required]
    });

    this.empresaService.findAll(0,100).subscribe(data => {
  this.empresas = data;
});

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(id).subscribe(p => {
        this.form.patchValue(p);
      });
    }
  }

  salvar() {
    if (this.form.invalid) return;

    const value = this.form.value;

    if (value.id) {
      this.service.update(value)
        .subscribe(() => this.router.navigate(['/producoes']));
    } else {
      this.service.create(value)
        .subscribe(() => this.router.navigate(['/producoes']));
    }
  }
}