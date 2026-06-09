import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ParticipacaoService } from '../../../services/participacao.service';
import { ArtistaService } from '../../../services/artista.service';
import { GrupoService } from '../../../services/grupo.service';
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

  form!: FormGroup;

  artistas: any[] = [];
  grupos: any[] = [];

  mensagemErro = '';
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private service: ParticipacaoService,
    private artistaService: ArtistaService,
    private grupoService: GrupoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      papel: ['', Validators.required],
      destaque: [false, Validators.required],
      idsProjetoMusical: [[], Validators.required]
    });

    this.artistaService.findAll(0, 100).subscribe({
      next: (a) => this.artistas = a,
      error: () => this.mensagemErro = 'Erro ao carregar artistas.'
    });

    this.grupoService.findAll(0, 100).subscribe({
      next: (g) => this.grupos = g,
      error: () => this.mensagemErro = 'Erro ao carregar grupos.'
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(Number(id)).subscribe({
        next: (p: any) => {
          this.form.patchValue({
            id: p.id,
            papel: p.papel,
            destaque: p.destaque,
            idsProjetoMusical: p.participantes?.map((x: any) => Number(x.id)) || []
          });
        },
        error: () => this.mensagemErro = 'Erro ao carregar participação.'
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/participacoes']);
  }

  get idsSelecionados(): number[] {
    return this.form.get('idsProjetoMusical')?.value || [];
  }

  projetoSelecionado(id: number): boolean {
    return this.idsSelecionados.includes(id);
  }

  toggleProjeto(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    let ids = [...this.idsSelecionados];

    if (checked) {
      ids.push(id);
    } else {
      ids = ids.filter(i => i !== id);
    }

    this.form.get('idsProjetoMusical')?.setValue(ids);
    this.form.get('idsProjetoMusical')?.markAsTouched();
  }

  salvar(): void {
    this.mensagemErro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    const payload = {
      id: value.id,
      papel: value.papel,
      destaque: value.destaque,
      idsProjetoMusical: (value.idsProjetoMusical || []).map((id: any) => Number(id))
    };

    if (payload.idsProjetoMusical.length === 0) {
      this.mensagemErro = 'Selecione pelo menos um participante.';
      return;
    }

    this.salvando = true;

    if (value.id) {
      this.service.update(payload).subscribe({
        next: () => {
          alert('Atualizado com sucesso!');
          this.router.navigate(['/participacoes']);
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao atualizar participação.';
          this.salvando = false;
        }
      });
    } else {
      this.service.create(payload).subscribe({
        next: () => {
          alert('Criado com sucesso!');
          this.router.navigate(['/participacoes']);
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao criar participação.';
          this.salvando = false;
        }
      });
    }
  }
}