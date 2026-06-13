import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ArtistaService } from '../../../services/artista.service';
import { EmpresaService } from '../../../services/empresa.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artista-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './artista-form.html',
  styleUrls: ['./artista-form.css']
})
export class ArtistaFormComponent implements OnInit {

  form!: FormGroup;
  empresas: any[] = [];

  mensagemErro = '';
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private service: ArtistaService,
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nomeCompleto: ['', [Validators.required, Validators.minLength(2)]],
      nomeArtistico: ['', [Validators.required, Validators.minLength(2)]],
      dataNascimento: ['', Validators.required],
      nacionalidade: ['', Validators.required],
      funcaoPrincipal: ['', Validators.required],
      idEmpresa: [null, Validators.required]
    });

    this.empresaService.findAll(0, 100).subscribe({
      next: (e) => this.empresas = e,
      error: () => this.mensagemErro = 'Erro ao carregar empresas.'
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(Number(id)).subscribe({
        next: (a) => {
          this.form.patchValue({
            ...a,
            idEmpresa: a.empresa?.id
          });
        },
        error: () => this.mensagemErro = 'Erro ao carregar artista.'
      });
    }
  }

  cancelar(): void {
    if (this.route.snapshot.queryParams['voltarParaAlbum']) {
      this.router.navigate(['/albums/new']);
      return;
    }

    this.router.navigate(['/artistas']);
  }

  voltarDepoisDeSalvar(): void {
    if (this.route.snapshot.queryParams['voltarParaAlbum']) {
      this.router.navigate(['/albums/new']);
      return;
    }

    this.router.navigate(['/artistas']);
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
      nomeCompleto: value.nomeCompleto,
      nomeArtistico: value.nomeArtistico,
      dataNascimento: value.dataNascimento,
      nacionalidade: value.nacionalidade,
      funcaoPrincipal: value.funcaoPrincipal,
      idEmpresa: Number(value.idEmpresa),
      id: value.id
    };

    if (value.id) {
      this.service.update(payload as any).subscribe({
        next: () => {
          alert('Atualizado com sucesso!');
          this.voltarDepoisDeSalvar();
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao atualizar artista. Verifique os dados.';
          this.salvando = false;
        }
      });
    } else {
      this.service.create(payload as any).subscribe({
        next: () => {
          alert('Criado com sucesso!');
          this.voltarDepoisDeSalvar();
        },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao criar artista. Verifique os dados.';
          this.salvando = false;
        }
      });
    }
  }
}