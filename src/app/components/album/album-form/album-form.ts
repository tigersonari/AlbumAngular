import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { AlbumService } from '../../../services/album.service';
import { ProducaoService } from '../../../services/producao.service';
import { ProjetoMusicalService } from '../../../services/projetomusical.service';

import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { GeneroService } from '../../../services/genero.service';

@Component({
  selector: 'app-album-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './album-form.html',
  styleUrls: ['./album-form.css']
})
export class AlbumFormComponent implements OnInit {

  form: any;

  producoes: any[] = [];
  projetos: any[] = [];

  constructor(
  private fb: FormBuilder,
  private service: AlbumService,
  private projetoService: ProjetoMusicalService, 
  private producaoService: ProducaoService,
  private generoService: GeneroService,
  private route: ActivatedRoute,
  private router: Router
) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      descricao: [''],
      lancamento: ['', Validators.required],
      formato: [null, Validators.required],
      idProducao: [null, Validators.required],
      idsProjetos: [[], Validators.required]
    });

    this.producaoService.findAll(0, 100)
      .subscribe(p => this.producoes = p);

    this.projetoService.findAll(0, 100)
      .subscribe(p => this.projetos = p);

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(id)
        .subscribe(a => this.form.patchValue(a));
    }
  }

  salvar() {
    if (this.form.invalid) return;

    const value = this.form.value;

    if (value.id) {
      this.service.update(value)
        .subscribe(() => this.router.navigate(['/albums']));
    } else {
      this.service.create(value)
        .subscribe(() => this.router.navigate(['/albums']));
    }
  }
}