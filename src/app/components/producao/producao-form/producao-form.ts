import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
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

  form!: FormGroup;
  empresas: Empresa[] = [];

  mensagemErro = '';
  salvando = false;

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
      engenheiroGravacao: ['', Validators.required],
      engenheiroMixagem: ['', Validators.required],
      engenheiroMasterizacao: ['', Validators.required],
      dataProducao: ['', Validators.required],
      idEmpresa: [null, Validators.required]
    });

    this.empresaService.findAll(0, 100).subscribe({
      next: (data) => this.empresas = data,
      error: () => this.mensagemErro = 'Erro ao carregar empresas.'
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(Number(id)).subscribe({
        next: (p) => {
          this.form.patchValue({
            id: p.id,
            produtor: p.produtor,
            engenheiroGravacao: p.engenheiroGravacao,
            engenheiroMixagem: p.engenheiroMixagem,
            engenheiroMasterizacao: p.engenheiroMasterizacao,
            dataProducao: p.dataProducao,
            idEmpresa: p.empresa?.id
          });
        },
        error: () => this.mensagemErro = 'Erro ao carregar produção.'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/producoes']);
  }

  salvar(): void {
    this.mensagemErro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;

    const value = this.form.value;

    const payload = {
      id: value.id,
      produtor: value.produtor,
      engenheiroGravacao: value.engenheiroGravacao,
      engenheiroMixagem: value.engenheiroMixagem,
      engenheiroMasterizacao: value.engenheiroMasterizacao,
      dataProducao: value.dataProducao,
      idEmpresa: Number(value.idEmpresa)
    };

    if (value.id) {
      this.service.update(payload).subscribe({
        next: () => {
          alert('Atualizado com sucesso!');
          this.router.navigate(['/producoes']);
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao atualizar produção. Verifique os dados.';
          this.salvando = false;
        }
      });
    } else {
      this.service.create(payload).subscribe({
        next: () => {
          alert('Criado com sucesso!');
          this.router.navigate(['/producoes']);
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao criar produção. Verifique os dados.';
          this.salvando = false;
        }
      });
    }
  }
}