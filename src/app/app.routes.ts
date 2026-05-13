import { Routes } from '@angular/router';
import { AlbumListComponent } from './components/album/album-list/album-list';
import { AlbumFormComponent } from './components/album/album-form/album-form';

import { GeneroListComponent } from './components/genero/genero-list/genero-list';
import { GeneroFormComponent } from './components/genero/genero-form/genero-form';

import { ProducaoListComponent } from './components/producao/producao-list/producao-list';
import { ProducaoFormComponent } from './components/producao/producao-form/producao-form';

import { EmpresaFormComponent } from './components/empresa/empresa-form/empresa-form';
import { EmpresaListComponent } from './components/empresa/empresa-list/empresa-list';

import { ArtistaListComponent } from './components/artista/artista-list/artista-list';
import { ArtistaFormComponent } from './components/artista/artista-form/artista-form';

import { GrupoListComponent } from './components/grupo/grupo-list/grupo-list';
import { GrupoFormComponent } from './components/grupo/grupo-form/grupo-form';

import { ComposicaoListComponent } from './components/composicao/composicao-list/composicao-list';
import { ComposicaoFormComponent } from './components/composicao/composicao-form/composicao-form';

import { FaixaListComponent } from './components/faixa/faixa-list/faixa-list';
import { FaixaFormComponent } from './components/faixa/faixa-form/faixa-form';

import { ParticipacaoListComponent } from './components/participacao/participacao-list/participacao-list';
import { ParticipacaoFormComponent } from './components/participacao/participacao-form/participacao-form';

export const routes: Routes = [
  { path: 'albums', component: AlbumListComponent },
  { path: 'albums/new', component: AlbumFormComponent },
  { path: 'albums/edit/:id', component: AlbumFormComponent },
  { path: '', redirectTo: 'albums', pathMatch: 'full' },

  { path: 'generos', component: GeneroListComponent },
  { path: 'generos/new', component: GeneroFormComponent },
  { path: 'generos/edit/:id', component: GeneroFormComponent },

  { path: 'producoes', component: ProducaoListComponent },
  { path: 'producoes/new', component: ProducaoFormComponent },
  { path: 'producoes/edit/:id', component: ProducaoFormComponent },

  { path: 'empresas', component: EmpresaListComponent },
  { path: 'empresas/new', component: EmpresaFormComponent },
  { path: 'empresas/edit/:id', component: EmpresaFormComponent },

  { path: 'artistas', component: ArtistaListComponent },
  { path: 'artistas/new', component: ArtistaFormComponent },
  { path: 'artistas/edit/:id', component: ArtistaFormComponent },

  { path: 'grupos', component: GrupoListComponent },
  { path: 'grupos/new', component: GrupoFormComponent },
  { path: 'grupos/edit/:id', component: GrupoFormComponent },

  { path: 'composicoes', component: ComposicaoListComponent },
  { path: 'composicoes/new', component: ComposicaoFormComponent },
  { path: 'composicoes/edit/:id', component: ComposicaoFormComponent },

  { path: 'faixas', component: FaixaListComponent },
  { path: 'faixas/new', component: FaixaFormComponent },
  { path: 'faixas/edit/:id', component: FaixaFormComponent },

  { path: 'participacoes', component: ParticipacaoListComponent },
  { path: 'participacoes/new', component: ParticipacaoFormComponent },
  { path: 'participacoes/edit/:id', component: ParticipacaoFormComponent }
];

