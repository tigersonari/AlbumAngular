import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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

  form: any;

  constructor(
    private fb: FormBuilder,
    private service: GeneroService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nomeGenero: ['', Validators.required],
      descricao: ['']
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(id).subscribe(g => {
        this.form.patchValue(g);
      });
    }
  }

  cancelar() {
  this.router.navigate(['/generos']);
}

salvar() {
  if (this.form.invalid) return;

  const value = this.form.value;

  if (value.id) {
    this.service.update(value).subscribe(() => {
      alert('Atualizado com sucesso!');
      this.router.navigate(['/generos']);
    });
  } else {
    this.service.create(value).subscribe(() => {
      alert('Criado com sucesso!');
      this.router.navigate(['/generos']);
    });
  }
}
}