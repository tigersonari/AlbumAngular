import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ComposicaoService } from '../../../services/composicao.service';
import { ArtistaService } from '../../../services/artista.service';
import { GrupoService } from '../../../services/grupo.service';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-composicao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './composicao-form.html',
  styleUrls: ['./composicao-form.css']
})
export class ComposicaoFormComponent implements OnInit {

  form: any;

  artistas: any[] = [];
  grupos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ComposicaoService,
    private artistaService: ArtistaService,
    private grupoService: GrupoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
  id: [null],
  data: ['', Validators.required],
  idsProjetoMusical: [[], Validators.required] // objetos
});

    this.artistaService.findAll(0, 100)
  .subscribe(a => this.artistas = a);

this.grupoService.findAll(0, 100)
  .subscribe(g => this.grupos = g);

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(id).subscribe(c => {
        this.form.patchValue(c);
      });
    }
  }

  cancelar() {
  this.router.navigate(['/artistas']);
}

  salvar() {
  if (this.form.invalid) {
    alert('Preencha todos os campos!');
    return;
  }

  const value = this.form.value;

  if (value.id) {
    this.service.update(value).subscribe({
      next: () => {
        alert('Atualizado com sucesso!');
        this.router.navigate(['/composicoes']);
      },
      error: (err) => alert(err.error?.message || 'Erro ao atualizar')
    });
  } else {
    this.service.create(value).subscribe({
      next: () => {
        alert('Criado com sucesso!');
        this.router.navigate(['/composicoes']);
      },
      error: (err) => alert(err.error?.message || 'Erro ao salvar')
    });
  }
}
}