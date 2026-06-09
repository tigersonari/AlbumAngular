import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empresa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './empresa-form.html',
  styleUrls: ['./empresa-form.css']
})
export class EmpresaFormComponent implements OnInit {

  form!: FormGroup;
  mensagemErro = '';
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private service: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nomeEmpresa: ['', [Validators.required, Validators.minLength(2)]],
      cnpj: ['', Validators.required],
      localizacao: [''],
      contato: ['']
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(Number(id)).subscribe({
        next: (e) => this.form.patchValue(e),
        error: () => this.mensagemErro = 'Erro ao carregar empresa.'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/empresas']);
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
          this.router.navigate(['/empresas']);
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao atualizar empresa. Verifique os dados.';
          this.salvando = false;
        }
      });
    } else {
      this.service.create(value).subscribe({
        next: () => {
          alert('Criado com sucesso!');
          this.router.navigate(['/empresas']);
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao criar empresa. Verifique os dados.';
          this.salvando = false;
        }
      });
    }
  }
}