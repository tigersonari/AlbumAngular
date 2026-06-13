import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';

import { FaixaService } from '../../../services/faixa.service';
import { AlbumService } from '../../../services/album.service';
import { GeneroService } from '../../../services/genero.service';
import { ComposicaoService } from '../../../services/composicao.service';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ArtistaService } from '../../../services/artista.service';
import { GrupoService } from '../../../services/grupo.service';
import { ParticipacaoService } from '../../../services/participacao.service';

@Component({
  selector: 'app-faixa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './faixa-form.html',
  styleUrls: ['./faixa-form.css']
})
export class FaixaFormComponent implements OnInit {

  form!: FormGroup;

  albuns: any[] = [];
  generos: any[] = [];
  composicoes: any[] = [];

  mensagemErro = '';
  salvando = false;

  artistas: any[] = [];
  grupos: any[] = [];

  participacaoPapel = '';
  participacaoDestaque = false;
  participantesSelecionados: number[] = [];

  tiposVersao = [
    { id: 1, nome: 'ORIGINAL' },
    { id: 2, nome: 'REMIX' },
    { id: 3, nome: 'ACUSTICO' },
    { id: 4, nome: 'LIVE' },
    { id: 5, nome: 'INSTRUMENTAL' },
    { id: 6, nome: 'COVER' },
    { id: 7, nome: 'REMASTERED' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: FaixaService,
    private albumService: AlbumService,
    private generoService: GeneroService,
    private composicaoService: ComposicaoService,
    private route: ActivatedRoute,
    private artistaService: ArtistaService,
    private grupoService: GrupoService,
    private participacaoService: ParticipacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      numeroFaixa: [null, Validators.required],
      duracao: [null, Validators.required],
      idioma: ['', Validators.required],
      idTipoVersao: [null, Validators.required],
      idGenero: [null, Validators.required],
      idComposicao: [null, Validators.required],
      idAlbum: [null, Validators.required]
    });

    /*this.albumService.findAll(0, 100).subscribe({
      next: (a) => this.albuns = a,
      error: () => this.mensagemErro = 'Erro ao carregar álbuns.'
    });*/

    this.albumService.findAll(0, 100).subscribe({
  next: (a) => {
    console.log('Álbuns carregados:', a);
    this.albuns = a;
  },
  error: (err: any) => {
    console.error('Erro ao carregar álbuns:', err);
    this.mensagemErro = `Erro ao carregar álbuns. Status: ${err.status}`;
  }
});

    this.generoService.findAll(0, 100).subscribe({
      next: (g) => this.generos = g,
      error: () => this.mensagemErro = 'Erro ao carregar gêneros.'
    });

    this.composicaoService.findAll(0, 100).subscribe({
      next: (c) => this.composicoes = c,
      error: () => this.mensagemErro = 'Erro ao carregar composições.'
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
        next: (f: any) => {
          this.form.patchValue({
            id: f.id,
            titulo: f.titulo,
            numeroFaixa: f.numeroFaixa,
            duracao: f.duracao,
            idioma: f.idioma,
            idTipoVersao: this.converterTipoVersaoParaId(f.tipoVersao),
            idGenero: f.genero?.id,
            idComposicao: f.composicao?.id,
            idAlbum: f.album?.id
          });
        },
        error: () => this.mensagemErro = 'Erro ao carregar faixa.'
      });
    }
  }

  converterTipoVersaoParaId(tipo: any): number | null {
    if (!tipo) return null;

    if (typeof tipo === 'number') {
      return tipo;
    }

    const nome = String(tipo).toUpperCase();

    const encontrado = this.tiposVersao.find(t => t.nome === nome);

    return encontrado?.id || null;
  }

  participanteSelecionado(id: number): boolean {
  return this.participantesSelecionados.includes(id);
}

toggleParticipante(id: number, event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;

  if (checked) {
    this.participantesSelecionados.push(id);
  } else {
    this.participantesSelecionados = this.participantesSelecionados.filter(i => i !== id);
  }
}

criarParticipacaoParaFaixa(idFaixa: number, finalizar: () => void): void {
  if (!this.participacaoPapel && this.participantesSelecionados.length === 0) {
    finalizar();
    return;
  }

  if (!this.participacaoPapel || this.participantesSelecionados.length === 0) {
    this.mensagemErro = 'Para criar participação, informe papel e selecione ao menos um participante.';
    this.salvando = false;
    return;
  }

  const payloadParticipacao = {
    papel: this.participacaoPapel,
    destaque: this.participacaoDestaque,
    idsProjetoMusical: this.participantesSelecionados,
    idFaixa: idFaixa
  };

  this.participacaoService.create(payloadParticipacao).subscribe({
    next: () => finalizar(),
    error: (err: any) => {
      console.error(err);
      this.mensagemErro = 'Faixa criada, mas erro ao criar participação.';
      this.salvando = false;
    }
  });
}

  cancelar(): void {
    this.router.navigate(['/faixas']);
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
      titulo: value.titulo,
      numeroFaixa: Number(value.numeroFaixa),
      duracao: Number(value.duracao),
      idioma: value.idioma,
      idTipoVersao: Number(value.idTipoVersao),
      idGenero: Number(value.idGenero),
      idAlbum: Number(value.idAlbum),
      idComposicao: Number(value.idComposicao)
    };

    if (value.id) {
      this.service.update(payload).subscribe({
        next: () => {
  this.criarParticipacaoParaFaixa(Number(value.id), () => {
    alert('Atualizado com sucesso!');
    this.router.navigate(['/faixas']);
  });
},
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao atualizar faixa. Verifique os dados.';
          this.salvando = false;
        }
      });
    } else {
      this.service.create(payload).subscribe({
  next: (faixaCriada: any) => {
    this.criarParticipacaoParaFaixa(faixaCriada.id, () => {
      alert('Faixa criada com sucesso!');
      this.router.navigate(['/faixas']);
    });
  },
        error: (err: any) => {
          console.error(err);
          this.mensagemErro = 'Erro ao criar faixa. Verifique os dados.';
          this.salvando = false;
        }
      });
    }
  }
}