import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { GrupoService } from '../../../services/grupo.service';
import { ArtistaService } from '../../../services/artista.service';
import { EmpresaService } from '../../../services/empresa.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjetoMusicalService } from '../../../services/projetomusical.service';

@Component({
  selector: 'app-grupo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './grupo-form.html',
  styleUrls: ['./grupo-form.css']
})
export class GrupoFormComponent implements OnInit {

  form: any;

  artistas: any[] = [];
  projetos: any[] = [];
  empresas: any;

  constructor(
    private fb: FormBuilder,
    private service: GrupoService,
    private artistaService: ArtistaService,
    private empresaService: EmpresaService,
    private projetoService: ProjetoMusicalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.form = this.fb.group({
  id: [null],
  nomeGrupo: ['', Validators.required],
  dataInicio: ['', Validators.required],
  dataTermino: [''],
  idEmpresa: [null, Validators.required],   //  CORRETO
  idsArtistas: this.fb.control<number[]>([], Validators.required)   //  CORRETO
  });

  this.artistaService.findAll(0, 100)
    .subscribe(a => this.artistas = a);

  this.empresaService.findAll(0, 100)
    .subscribe(e => this.empresas = e);

  const id = this.route.snapshot.params['id'];

  if (id) {
  this.service.findById(id).subscribe(g => {
    this.form.patchValue({
      id: g.id,
      nomeGrupo: g.nomeGrupo,
      dataInicio: g.dataInicio,
      dataTermino: g.dataTermino,
      idEmpresa: g.empresa?.id,
      idsArtistas: g.membros?.map(m => m.id) || []
    });
  });
}
}

cancelar() {
  this.router.navigate(['/grupos']);
}

  salvar() {
    if (this.form.invalid) return;

    const value = this.form.value;

    if (value.id) {
      this.service.update(value)
        .subscribe(() => this.router.navigate(['/grupos']));
    } else {
      this.service.create(value)
        .subscribe(() => this.router.navigate(['/grupos']));
    }
  }
}