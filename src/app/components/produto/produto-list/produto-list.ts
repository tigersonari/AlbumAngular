import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../../models/produto.model';
import { Album } from '../../../models/album.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListaDesejosService } from '../../../services/lista-desejos.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { FaixaService } from '../../../services/faixa.service';
import { Faixa } from '../../../models/faixa.model';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './produto-list.html',
  styleUrls: ['./produto-list.css']
})
export class ProdutoListComponent implements OnInit {

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  faixas: Faixa[] = [];

  filtro = '';
  modo: 'home' | 'lista' | 'categorias' = 'home';
  tituloLista = 'Todos os álbuns';

  listaCategorias: any[] = [];
  tipoLista: 'generos' | 'decadas' | 'artistas' | '' = '';

  carregando = false;
  mensagemErro = '';

  constructor(
    private produtoService: ProdutoService,
    private listaDesejosService: ListaDesejosService,
    private carrinhoService: CarrinhoService,
    private faixaService: FaixaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarFaixas();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.produtoService.findAll().subscribe({
      next: (data) => {
        this.produtos = data;
        this.produtosFiltrados = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar produtos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  carregarFaixas(): void {
    this.faixaService.findAll(0, 500).subscribe({
      next: (data) => this.faixas = data,
      error: () => console.log('Erro ao carregar faixas.')
    });
  }

  pesquisar(): void {
    const termo = this.filtro.trim().toLowerCase();

    if (!termo) {
      this.voltarHome();
      return;
    }

    this.modo = 'lista';
    this.tituloLista = `Resultado para "${this.filtro}"`;

    const idsAlbunsPorFaixa = this.faixas
      .filter(f =>
        f.titulo?.toLowerCase().includes(termo) ||
        f.genero?.nomeGenero?.toLowerCase().includes(termo) ||
        f.participacoes?.some((p: any) =>
          p.papel?.toLowerCase().includes(termo) ||
          p.participantes?.some((part: any) =>
            (part.nomeArtistico || part.nomeGrupo || '').toLowerCase().includes(termo)
          )
        )
      )
      .map(f => Number(f.album?.id))
      .filter(id => !isNaN(id));

    this.produtosFiltrados = this.produtos.filter(p => {
      const album = p.album;

      return (
        album.titulo?.toLowerCase().includes(termo) ||
        album.descricao?.toLowerCase().includes(termo) ||
        album.artistasPrincipais?.some(a =>
          (a.nomeArtistico || a.nomeGrupo || '').toLowerCase().includes(termo)
        ) ||
        album.generos?.some(g =>
          g.nomeGenero?.toLowerCase().includes(termo)
        ) ||
        album.producao?.produtor?.toLowerCase().includes(termo) ||
        idsAlbunsPorFaixa.includes(Number(album.id))
      );
    });
  }

  get destaques(): Produto[] {
    return this.produtos.slice(0, 5);
  }

  get todosPreview(): Produto[] {
    return this.produtos.slice(0, 8);
  }

  get generos(): any[] {
    const mapa = new Map<string, any>();

    this.produtos.forEach(p => {
      p.album.generos?.forEach(g => {
        if (!mapa.has(g.nomeGenero)) {
          mapa.set(g.nomeGenero, {
            nome: g.nomeGenero,
            imagem: this.imagemGenero(g.nomeGenero),
            total: 1
          });
        } else {
          mapa.get(g.nomeGenero).total++;
        }
      });
    });

    return Array.from(mapa.values());
  }

  get artistas(): any[] {
    const mapa = new Map<string, any>();

    this.produtos.forEach(p => {
      p.album.artistasPrincipais?.forEach(a => {
        const nome = a.nomeArtistico || a.nomeGrupo;
        if (!nome) return;

        if (!mapa.has(nome)) {
          mapa.set(nome, {
            nome,
            imagem: this.imagemArtista(nome),
            total: 1
          });
        } else {
          mapa.get(nome).total++;
        }
      });
    });

    return Array.from(mapa.values());
  }

  get decadas(): any[] {
    const mapa = new Map<string, any>();

    this.produtos.forEach(p => {
      const ano = Number(p.album.lancamento?.substring(0, 4));
      if (!ano) return;

      const decada = `${Math.floor(ano / 10) * 10}s`;

      if (!mapa.has(decada)) {
        mapa.set(decada, {
          nome: decada,
          imagem: this.imagemDecada(decada),
          total: 1
        });
      } else {
        mapa.get(decada).total++;
      }
    });

    return Array.from(mapa.values());
  }

  abrirTodos(): void {
    this.modo = 'lista';
    this.tituloLista = 'Todos os álbuns';
    this.produtosFiltrados = [...this.produtos];
  }

  abrirTodosGeneros(): void {
    this.tipoLista = 'generos';
    this.tituloLista = 'Todos os Gêneros';
    this.listaCategorias = this.generos;
    this.modo = 'categorias';
  }

  abrirTodasDecadas(): void {
    this.tipoLista = 'decadas';
    this.tituloLista = 'Todas as Décadas';
    this.listaCategorias = this.decadas;
    this.modo = 'categorias';
  }

  abrirTodosArtistas(): void {
    this.tipoLista = 'artistas';
    this.tituloLista = 'Todos os Artistas e Grupos';
    this.listaCategorias = this.artistas;
    this.modo = 'categorias';
  }

  abrirCategoria(tipo: 'generos' | 'decadas' | 'artistas', nome: string): void {
    if (tipo === 'generos') {
      this.filtrarGenero(nome);
      return;
    }

    if (tipo === 'decadas') {
      this.filtrarDecada(nome);
      return;
    }

    this.filtrarArtista(nome);
  }

  filtrarGenero(nome: string): void {
  const termo = nome.trim().toLowerCase();

  this.modo = 'lista';
  this.tituloLista = `Gênero: ${nome}`;

  this.produtosFiltrados = this.produtos.filter(p =>
    p.album.generos?.some(g =>
      g.nomeGenero?.trim().toLowerCase() === termo
    )
  );

  this.cdr.detectChanges();
}

filtrarArtista(nome: string): void {
  const termo = nome.trim().toLowerCase();

  this.modo = 'lista';
  this.tituloLista = `Artista/Grupo: ${nome}`;

  this.produtosFiltrados = this.produtos.filter(p =>
    p.album.artistasPrincipais?.some(a =>
      (a.nomeArtistico || a.nomeGrupo || '')
        .trim()
        .toLowerCase() === termo
    )
  );

  this.cdr.detectChanges();
}

filtrarDecada(decada: string): void {
  this.modo = 'lista';
  this.tituloLista = `Década: ${decada}`;

  const inicio = Number(decada.replace('s', ''));

  this.produtosFiltrados = this.produtos.filter(p => {
    const ano = Number(p.album.lancamento?.substring(0, 4));
    return ano >= inicio && ano <= inicio + 9;
  });

  this.cdr.detectChanges();
}

  voltarHome(): void {
    this.modo = 'home';
    this.filtro = '';
    this.produtosFiltrados = [...this.produtos];
  }

  getProjetos(album: Album): string {
    return album.artistasPrincipais
      ?.map(p => p.nomeArtistico || p.nomeGrupo)
      .join(', ') || '';
  }

  getGeneros(album: Album): string {
    return album.generos
      ?.map(g => g.nomeGenero)
      .join(', ') || '';
  }

  getImagem(produto: Produto): string {
    return produto.album?.capaUrl || `/img/albuns/${produto.album.id}.jpg`;
  }

  usarImagemPadrao(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.onerror = null;
  img.src = '/img/albuns/album-placeholder.jpg';
}

  adicionarAListaDesejos(produto: Produto): void {
    this.listaDesejosService.adicionar({
      id: produto.id,
      titulo: produto.album.titulo,
      preco: produto.preco,
      imagem: this.getImagem(produto)
    });

    alert('Produto adicionado à lista de desejos!');
  }

  adicionarAoCarrinho(produto: Produto): void {
    if (produto.quantidadeEstoque <= 0) {
      alert('Produto sem estoque disponível.');
      return;
    }

    this.carrinhoService.adicionar({
      id: produto.id,
      titulo: produto.album.titulo,
      preco: produto.preco,
      quantidade: 1,
      imagem: this.getImagem(produto)
    });

    alert('Produto adicionado ao carrinho!');
  }

  normalizarNome(nome: string): string {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, 'e')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  imagemGenero(nome: string): string {
    return `/img/generos/${this.normalizarNome(nome)}.jpg`;
  }

  imagemArtista(nome: string): string {
    return `/img/artistas/${this.normalizarNome(nome)}.jpg`;
  }

  imagemDecada(nome: string): string {
    return `/img/decadas/${this.normalizarNome(nome)}.jpg`;
  }

  usarCategoriaPadrao(event: Event): void {
  const img = event.target as HTMLImageElement;

  img.onerror = null;

  img.src =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
        <rect width="100%" height="100%" fill="#1a1a1a"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          fill="#ffffff" font-size="32" font-family="Arial">
          AlbumMix
        </text>
      </svg>
    `);
}

  selecionarCategoria(
  event: Event,
  tipo: 'generos' | 'decadas' | 'artistas',
  nome: string
): void {
  event.preventDefault();
  event.stopPropagation();

  if (tipo === 'generos') {
    this.filtrarGenero(nome);
  }

  if (tipo === 'decadas') {
    this.filtrarDecada(nome);
  }

  if (tipo === 'artistas') {
    this.filtrarArtista(nome);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  this.cdr.detectChanges();
}



}