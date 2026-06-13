import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { AlbumService } from '../../../services/album.service';
import { ProducaoService } from '../../../services/producao.service';
import { ArtistaService } from '../../../services/artista.service';
import { GrupoService } from '../../../services/grupo.service';
import { GeneroService } from '../../../services/genero.service';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProdutoService } from '../../../services/produto.service';

import { SeaweedService } from '../../../services/seaweed.service';

@Component({
  selector: 'app-album-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './album-form.html',
  styleUrls: ['./album-form.css']
})
export class AlbumFormComponent implements OnInit {

  form!: FormGroup;

  producoes: any[] = [];
  artistas: any[] = [];
  grupos: any[] = [];
  generos: any[] = [];

  mensagemErro = '';
  salvando = false;

  formatos = [
    { id: 1, nome: 'SINGLE' },
    { id: 2, nome: 'MIXTAPE' },
    { id: 3, nome: 'DELUXE' },
    { id: 4, nome: 'EP' },
    { id: 5, nome: 'LONGPLAY' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: AlbumService,
    private producaoService: ProducaoService,
    private artistaService: ArtistaService,
    private grupoService: GrupoService,
    private generoService: GeneroService,
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private seaweedService: SeaweedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      lancamento: ['', Validators.required],
      idFormato: [null, Validators.required],
      idProducao: [null, Validators.required],
      idProjetoMusical: [[], Validators.required],
      idGenero: [[], Validators.required],
      preco: [null, Validators.required],
      quantidadeEstoque: [null, Validators.required],
      capaUrl: [''],
      idProduto: [null]
    });

    const rascunho = localStorage.getItem('albumEmEdicao');

    if (rascunho && !this.route.snapshot.params['id']) {
      this.form.patchValue(JSON.parse(rascunho));
    }

    this.producaoService.findAll(0, 100).subscribe({
      next: (p) => this.producoes = p,
      error: () => this.mensagemErro = 'Erro ao carregar produções.'
    });

    this.artistaService.findAll(0, 100).subscribe({
      next: (a) => this.artistas = a,
      error: () => this.mensagemErro = 'Erro ao carregar artistas.'
    });

    this.grupoService.findAll(0, 100).subscribe({
      next: (g) => this.grupos = g,
      error: () => this.mensagemErro = 'Erro ao carregar grupos.'
    });

    this.generoService.findAll(0, 100).subscribe({
      next: (g) => this.generos = g,
      error: () => this.mensagemErro = 'Erro ao carregar gêneros.'
    });

    const id = this.route.snapshot.params['id'];

    if (id) {
      if (id) {
  const idAlbum = Number(id);

  this.service.findById(idAlbum).subscribe({
    next: (a: any) => {
      this.form.patchValue({
        id: a.id,
        titulo: a.titulo,
        descricao: a.descricao,
        lancamento: a.lancamento,
        idFormato: this.converterFormatoParaId(a.formato),
        idProducao: a.producao?.id,
        idProjetoMusical: a.artistasPrincipais?.map((p: any) => Number(p.id)) || [],
        idGenero: a.generos?.map((g: any) => Number(g.id)) || [],
        capaUrl: a.capaUrl
      });

      this.produtoService.findByAlbum(idAlbum).subscribe({
        next: (produto: any) => {
          this.form.patchValue({
            idProduto: produto.id,
            preco: produto.preco,
            quantidadeEstoque: produto.quantidadeEstoque
          });
        },
        error: () => {
          console.log('Álbum ainda não possui produto cadastrado.');
        }
      });
    },
    error: () => this.mensagemErro = 'Erro ao carregar álbum.'
  });
}
    }
  }

  converterFormatoParaId(formato: any): number | null {
    if (!formato) return null;

    if (typeof formato === 'number') return formato;

    const nome = String(
      formato.nome || formato.name || formato.label || formato
    ).toUpperCase();

    return this.formatos.find(f => f.nome === nome)?.id || null;
  }

  cancelar(): void {
    this.router.navigate(['/albums']);
  }

  get projetosSelecionados(): number[] {
    return this.form.get('idProjetoMusical')?.value || [];
  }

  projetoSelecionado(id: number): boolean {
    return this.projetosSelecionados.includes(id);
  }

  toggleProjeto(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    let ids = [...this.projetosSelecionados];

    if (checked) {
      ids.push(id);
    } else {
      ids = ids.filter(i => i !== id);
    }

    this.form.get('idProjetoMusical')?.setValue(ids);
    this.form.get('idProjetoMusical')?.markAsTouched();
  }

  get generosSelecionados(): number[] {
    return this.form.get('idGenero')?.value || [];
  }

  generoSelecionado(id: number): boolean {
    return this.generosSelecionados.includes(id);
  }

  toggleGenero(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    let ids = [...this.generosSelecionados];

    if (checked) {
      ids.push(id);
    } else {
      ids = ids.filter(i => i !== id);
    }

    this.form.get('idGenero')?.setValue(ids);
    this.form.get('idGenero')?.markAsTouched();
  }

  salvarRascunhoAlbum(): void {
  localStorage.setItem(
    'albumEmEdicao',
    JSON.stringify(this.form.value)
  );
}

novoArtista(): void {
  this.salvarRascunhoAlbum();
  this.router.navigate(['/artistas/new'], {
    queryParams: { voltarParaAlbum: true }
  });
}

novoGrupo(): void {
  this.salvarRascunhoAlbum();
  this.router.navigate(['/grupos/new'], {
    queryParams: { voltarParaAlbum: true }
  });
}

novoGenero(): void {
  this.salvarRascunhoAlbum();
  this.router.navigate(['/generos/new'], {
    queryParams: { voltarParaAlbum: true }
  });
}

novaProducao(): void {
  this.salvarRascunhoAlbum();
  this.router.navigate(['/producoes/new'], {
    queryParams: { voltarParaAlbum: true }
  });
}

limparRascunhoAlbum(): void {
  localStorage.removeItem('albumEmEdicao');
}

  salvar(): void {
  this.mensagemErro = '';

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const value = this.form.value;

  const payloadAlbum = {
    id: value.id,
    titulo: value.titulo,
    descricao: value.descricao,
    lancamento: value.lancamento,
    idFormato: Number(value.idFormato),
    idProducao: Number(value.idProducao),
    idProjetoMusical: (value.idProjetoMusical || []).map((id: any) => Number(id)),
    idGenero: (value.idGenero || []).map((id: any) => Number(id)),
    capaUrl: value.capaUrl
  };

  if (payloadAlbum.idProjetoMusical.length === 0) {
    this.mensagemErro = 'Selecione pelo menos um artista ou grupo.';
    return;
  }

  if (payloadAlbum.idGenero.length === 0) {
    this.mensagemErro = 'Selecione pelo menos um gênero.';
    return;
  }

  this.salvando = true;

  if (value.id) {
    this.service.update(payloadAlbum).subscribe({
      next: () => {
        const payloadProduto = {
          id: value.idProduto,
          idAlbum: Number(value.id),
          preco: Number(value.preco),
          quantidadeEstoque: Number(value.quantidadeEstoque)
        };

        if (value.idProduto) {
          this.produtoService.update(payloadProduto).subscribe({
            next: () => {
              alert('Álbum e produto atualizados com sucesso!');
              this.limparRascunhoAlbum();
              this.router.navigate(['/albums']);
            },
            error: (err: any) => {
              console.error(err);
              this.mensagemErro = 'Álbum atualizado, mas erro ao atualizar produto.';
              this.salvando = false;
            }
          });
        } else {
          this.produtoService.create({
            idAlbum: Number(value.id),
            preco: Number(value.preco),
            quantidadeEstoque: Number(value.quantidadeEstoque)
          }).subscribe({
            next: () => {
              alert('Álbum atualizado e produto criado com sucesso!');
              this.limparRascunhoAlbum();
              this.router.navigate(['/albums']);
            },
            error: (err: any) => {
              console.error(err);
              this.mensagemErro = 'Álbum atualizado, mas erro ao criar produto.';
              this.salvando = false;
            }
          });
        }
      },
      error: (err: any) => {
        console.error(err);
        this.mensagemErro = 'Erro ao atualizar álbum.';
        this.salvando = false;
      }
    });
  } else {
    console.log('PAYLOAD ALBUM ENVIADO:', payloadAlbum); //
    this.service.create(payloadAlbum).subscribe({
      next: (albumCriado: any) => {
        this.produtoService.create({
          idAlbum: Number(albumCriado.id),
          preco: Number(value.preco),
          quantidadeEstoque: Number(value.quantidadeEstoque)
        }).subscribe({
          next: () => {
            alert('Álbum e produto criados com sucesso!');
            this.limparRascunhoAlbum();
            this.router.navigate(['/albums']);
          },
          error: (err: any) => {
            console.error(err);
            this.mensagemErro = 'Álbum criado, mas erro ao criar produto.';
            this.salvando = false;
          }
        });
      },
      error: (err: any) => {
        console.error(err);
        this.mensagemErro = 'Erro ao criar álbum.';
        this.salvando = false;
      }
    });
  }
}

get capaUrl(): string {
  return this.form.get('capaUrl')?.value || '';
}

uploadCapa(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  this.seaweedService.upload(file).subscribe({
    next: (url) => {
      console.log('URL DA CAPA GERADA:', url);

      this.form.patchValue({
        capaUrl: url
      });

      console.log('FORM APÓS UPLOAD:', this.form.value);

      alert('Capa enviada com sucesso!');
    },
    error: (err) => {
      console.error(err);
      this.mensagemErro = 'Erro ao enviar capa.';
    }
  });
}

}