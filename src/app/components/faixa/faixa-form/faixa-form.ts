import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { FaixaService } from '../../../services/faixa.service';
import { AlbumService } from '../../../services/album.service';
import { GeneroService } from '../../../services/genero.service';
import { ComposicaoService } from '../../../services/composicao.service';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faixa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './faixa-form.html',
  styleUrls: ['./faixa-form.css']
})
export class FaixaFormComponent implements OnInit {

  form: any;

  albuns: any[] = [];
  generos: any[] = [];
  composicoes: any[] = [];

  tiposVersao = [
    { id: 1, nome: 'Original' },
    { id: 2, nome: 'Remix' },
    { id: 3, nome: 'Acustisco' },
    { id: 4, nome: 'Live' },
    { id: 5, nome: 'Instrumental' },
    { id: 6, nome: 'Cover' },
    { id: 7, nome: 'Remastered' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: FaixaService,
    private albumService: AlbumService,
    private generoService: GeneroService,
    private composicaoService: ComposicaoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      numeroFaixa: [null, Validators.required],
      duracao: [null, Validators.required],
      idioma: ['', Validators.required],
      tipoVersao: [null, Validators.required],
      idGenero: [null, Validators.required],
      idComposicao: [null, Validators.required],
      idAlbum: [null, Validators.required]
    });

    this.albumService.findAll(0, 100).subscribe(a => this.albuns = a);
    this.generoService.findAll().subscribe(g => this.generos = g);
    this.composicaoService.findAll(0, 100).subscribe(c => this.composicoes = c);

    const id = this.route.snapshot.params['id'];

    if (id) {
      this.service.findById(id).subscribe(f => this.form.patchValue(f));
    }
  }

  salvar() {
    if (this.form.invalid) return;

    const value = this.form.value;

    if (value.id) {
      this.service.update(value)
        .subscribe(() => this.router.navigate(['/faixas']));
    } else {
      this.service.create(value)
        .subscribe(() => this.router.navigate(['/faixas']));
    }
  }
}