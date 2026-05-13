import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ParticipacaoService } from '../../../services/participacao.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participacao-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './participacao-form.html',
  styleUrls: ['./participacao-form.css']
})
export class ParticipacaoFormComponent implements OnInit {

  form: any;

  constructor(
    private fb: FormBuilder,
    private service: ParticipacaoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      papel: ['', Validators.required],
      destaque: [false],
      idFaixa: [null, Validators.required],
      idsProjetoMusical: [[], Validators.required]
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(id).subscribe(p => this.form.patchValue(p));
    }
  }

  salvar() {
    if (this.form.invalid) return;

    const value = this.form.value;

    if (value.id) {
      this.service.update(value)
        .subscribe(() => this.router.navigate(['/participacoes']));
    } else {
      this.service.create(value)
        .subscribe(() => this.router.navigate(['/participacoes']));
    }
  }
}