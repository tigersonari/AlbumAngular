import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { GrupoService } from '../../../services/grupo.service';
import { ArtistaService } from '../../../services/artista.service';
import { EmpresaService } from '../../../services/empresa.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grupo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './grupo-form.html',
  styleUrls: ['./grupo-form.css']
})
export class GrupoFormComponent implements OnInit {

  form!: FormGroup;

  artistas: any[] = [];
  empresas: any[] = [];

  mensagemErro = '';
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private service: GrupoService,
    private artistaService: ArtistaService,
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nomeGrupo: ['', [Validators.required, Validators.minLength(2)]],
      dataInicio: ['', Validators.required],
      dataTermino: [''],
      idEmpresa: [null, Validators.required],
      idsArtistas: [[], Validators.required]
    });

    this.artistaService.findAll(0, 100).subscribe({
      next: (a) => this.artistas = a,
      error: () => this.mensagemErro = 'Erro ao carregar artistas.'
    });

    this.empresaService.findAll(0, 100).subscribe({
      next: (e) => this.empresas = e,
      error: () => this.mensagemErro = 'Erro ao carregar empresas.'
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(Number(id)).subscribe({
        next: (g) => {
          this.form.patchValue({
            id: g.id,
            nomeGrupo: g.nomeGrupo,
            dataInicio: g.dataInicio,
            dataTermino: g.dataTermino,
            idEmpresa: g.empresa?.id,
            idsArtistas: g.membros?.map((m: any) => Number(m.id)) || []
          });
        },
        error: () => this.mensagemErro = 'Erro ao carregar grupo.'
      });
    }
  }

  cancelar(): void {
    if (this.route.snapshot.queryParams['voltarParaAlbum']) {
      this.router.navigate(['/albums/new']);
      return;
    }

    this.router.navigate(['/grupos']);
  }

  voltarDepoisDeSalvar(): void {
    if (this.route.snapshot.queryParams['voltarParaAlbum']) {
      this.router.navigate(['/albums/new']);
      return;
    }

    this.router.navigate(['/grupos']);
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
      nomeGrupo: value.nomeGrupo,
      dataInicio: value.dataInicio,
      dataTermino: value.dataTermino || null,
      idEmpresa: Number(value.idEmpresa),
      idsArtistas: (value.idsArtistas || []).map((id: any) => Number(id))
    };

    if (payload.idsArtistas.length === 0) {
      this.mensagemErro = 'Selecione pelo menos um integrante.';
      return;
    }

    this.salvando = true;

    if (value.id) {
      this.service.update(payload).subscribe({
        next: () => {
          alert('Atualizado com sucesso!');
          this.voltarDepoisDeSalvar();
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao atualizar grupo.';
          this.salvando = false;
        }
      });
    } else {
      this.service.create(payload).subscribe({
        next: () => {
          alert('Criado com sucesso!');
          this.voltarDepoisDeSalvar();
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao criar grupo.';
          this.salvando = false;
        }
      });
    }
  }

  get idsArtistasSelecionados(): number[] {
    return this.form.get('idsArtistas')?.value || [];
  }

  artistaSelecionado(id: number): boolean {
    return this.idsArtistasSelecionados.includes(id);
  }

  toggleArtista(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    let ids = [...this.idsArtistasSelecionados];

    if (checked) {
      ids.push(id);
    } else {
      ids = ids.filter(i => i !== id);
    }

    this.form.get('idsArtistas')?.setValue(ids);
    this.form.get('idsArtistas')?.markAsTouched();
  }
}