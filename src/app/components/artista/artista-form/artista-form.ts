import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ArtistaService } from '../../../services/artista.service';
import { EmpresaService } from '../../../services/empresa.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjetoMusicalService } from '../../../services/projetomusical.service';

@Component({
  selector: 'app-artista-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './artista-form.html',
  styleUrls: ['./artista-form.css']
})
export class ArtistaFormComponent implements OnInit {

  form: any;
  empresas: any[] = [];
  projetos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ArtistaService,
    private empresaService: EmpresaService,
    private projetoService: ProjetoMusicalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.form = this.fb.group({
    id: [null],
    nomeCompleto: ['', Validators.required],
    nomeArtistico: ['', Validators.required],
    dataNascimento: ['', Validators.required],
    nacionalidade: ['', Validators.required],
    funcaoPrincipal: ['', Validators.required],
    idEmpresa: [null, Validators.required]
  });

  this.empresaService.findAll(0, 100)
    .subscribe(e => this.empresas = e);

  const id = this.route.snapshot.params['id'];

  if (id) {
    this.service.findById(id).subscribe(a => {
      this.form.patchValue({
        ...a,
        idEmpresa: a.empresa?.id
      });
    });
  }
}

cancelar() {
  this.router.navigate(['/artistas']);
}

  salvar() {
  if (this.form.invalid) return; 

  const value = this.form.value;

  const payload = {
    ...value,
    idEmpresa: value.idEmpresa
  };

  if (value.id) {
    this.service.update(payload)
      .subscribe(() => this.router.navigate(['/artistas']));
  } else {
    this.service.create(payload)
      .subscribe(() => this.router.navigate(['/artistas']));
  }
}
}