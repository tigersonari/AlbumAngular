import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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

  form: any;

  constructor(
    private fb: FormBuilder,
    private service: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
  id: [null],
  nomeEmpresa: ['', Validators.required], 
  cnpj: ['', Validators.required],
  localizacao: [''],
  contato: ['']
});

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(id).subscribe(e => {
        this.form.patchValue(e);
      });
    }
  }

  cancelar() {
  this.router.navigate(['/empresas']);
}

salvar() {
  if (this.form.invalid) return;

  const value = this.form.value;

  if (value.id) {
    this.service.update(value).subscribe(() => {
      alert('Atualizado com sucesso!');
      this.router.navigate(['/empresas']);
    });
  } else {
    this.service.create(value).subscribe({
  next: () => {
    alert('Salvo com sucesso!');
    this.router.navigate(['/empresas']);
    setTimeout(() => window.location.reload(), 100);
  },
  error: () => {
    alert('Erro ao salvar');
  }
});
  }
}
}