import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { GeneroService } from '../../../services/genero.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-genero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './genero-form.html',
  styleUrls: ['./genero-form.css']
})
export class GeneroFormComponent implements OnInit {

  form!: FormGroup;
  mensagemErro = '';
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private service: GeneroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nomeGenero: ['', [Validators.required, Validators.minLength(2)]],
      descricao: ['']
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(Number(id)).subscribe({
        next: (g) => this.form.patchValue(g),
        error: () => this.mensagemErro = 'Erro ao carregar gênero.'
      });
    }
  }

  cancelar(): void {
    if (this.route.snapshot.queryParams['voltarParaAlbum']) {
      this.router.navigate(['/albums/new']);
      return;
    }

    this.router.navigate(['/generos']);
  }

  voltarDepoisDeSalvar(): void {
    if (this.route.snapshot.queryParams['voltarParaAlbum']) {
      this.router.navigate(['/albums/new']);
      return;
    }

    this.router.navigate(['/generos']);
  }

  salvar(): void {
    this.mensagemErro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    const value = this.form.value;

    if (value.id) {
      this.service.update(value).subscribe({
        next: () => {
          alert('Atualizado com sucesso!');
          this.voltarDepoisDeSalvar();
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao atualizar gênero. Verifique os dados.';
          this.salvando = false;
        }
      });
    } else {
      this.service.create(value).subscribe({
        next: () => {
          alert('Criado com sucesso!');
          this.voltarDepoisDeSalvar();
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao criar gênero. Verifique os dados.';
          this.salvando = false;
        }
      });
    }
  }
}