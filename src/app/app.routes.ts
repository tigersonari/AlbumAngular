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

import { ProdutoListComponent } from './components/produto/produto-list/produto-list';
import { ProdutoDetailComponent } from './components/produto/produto-detail/produto-detail';

import { CarrinhoComponent } from './components/produto/carrinho/carrinho';

import { CheckoutComponent } from './components/checkout/checkout';

import { ResumoCompraComponent } from './components/resumo-compra/resumo-compra';

import { ListaDesejosComponent } from './components/lista-desejos/lista-desejos';

import { LoginComponent } from './components/login/login';

import { CadastroComponent } from './components/cadastro/cadastro';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

import { MeusPedidosComponent } from './components/meus-pedidos/meus-pedidos';
import { PedidoDetailComponent } from './components/pedido-detail/pedido-detail';
import { DashboardComponent } from './components/dashboard/dashboard';

import { EnderecosComponent } from './components/enderecos/enderecos';

import { PerfilComponent } from './components/perfil/perfil';

import { EsqueciSenhaComponent } from './components/esqueci-senha/esqueci-senha';
import { RedefinirSenhaComponent } from './components/redefinir-senha/redefinir-senha';





export const routes: Routes = [
   // públicas
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'esqueci-senha', component: EsqueciSenhaComponent },
  { path: 'redefinir-senha', component: RedefinirSenhaComponent },

  // loja / usuário logado
  {
    path: 'produtos',
    component: ProdutoListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'produtos/:id',
    component: ProdutoDetailComponent,
    canActivate: [authGuard]
  },
  {
    path: 'carrinho',
    component: CarrinhoComponent,
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'resumo-compra',
    component: ResumoCompraComponent,
    canActivate: [authGuard]
  },
  {
    path: 'lista-desejos',
    component: ListaDesejosComponent,
    canActivate: [authGuard]
  },
  {
  path: 'meus-pedidos',
  component: MeusPedidosComponent,
  canActivate: [authGuard]
},
{
  path: 'meus-pedidos/:id',
  component: PedidoDetailComponent,
  canActivate: [authGuard]
},
{
  path: 'enderecos',
  component: EnderecosComponent,
  canActivate: [authGuard]
},
{
  path: 'perfil',
  component: PerfilComponent,
  canActivate: [authGuard]
},

  // álbuns - ADM
  {
    path: 'albums',
    component: AlbumListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'albums/new',
    component: AlbumFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'albums/edit/:id',
    component: AlbumFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },

  // gêneros - ADM
  {
    path: 'generos',
    component: GeneroListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'generos/new',
    component: GeneroFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'generos/edit/:id',
    component: GeneroFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },

  // produções - ADM
  {
    path: 'producoes',
    component: ProducaoListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'producoes/new',
    component: ProducaoFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'producoes/edit/:id',
    component: ProducaoFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADM'] }
},

  // empresas - ADM
  {
    path: 'empresas',
    component: EmpresaListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'empresas/new',
    component: EmpresaFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'empresas/edit/:id',
    component: EmpresaFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },

  // artistas - ADM
  {
    path: 'artistas',
    component: ArtistaListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'artistas/new',
    component: ArtistaFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'artistas/edit/:id',
    component: ArtistaFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },

  // grupos - ADM
  {
    path: 'grupos',
    component: GrupoListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'grupos/new',
    component: GrupoFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'grupos/edit/:id',
    component: GrupoFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },

  // composições - ADM
  {
    path: 'composicoes',
    component: ComposicaoListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'composicoes/new',
    component: ComposicaoFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'composicoes/edit/:id',
    component: ComposicaoFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },

  // faixas - ADM
  {
    path: 'faixas',
    component: FaixaListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'faixas/new',
    component: FaixaFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'faixas/edit/:id',
    component: FaixaFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  

  // participações - ADM
  {
    path: 'participacoes',
    component: ParticipacaoListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'participacoes/new',
    component: ParticipacaoFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },
  {
    path: 'participacoes/edit/:id',
    component: ParticipacaoFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADM'] }
  },

  // dashboard
  {
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADM'] }
}
];

