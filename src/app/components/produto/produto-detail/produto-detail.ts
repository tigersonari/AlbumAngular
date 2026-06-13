import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../../models/produto.model';
import { Album } from '../../../models/album.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CarrinhoService } from '../../../services/carrinho.service';
import { ListaDesejosService } from '../../../services/lista-desejos.service';

import { ChangeDetectorRef } from '@angular/core';

import { FaixaService } from '../../../services/faixa.service';
import { Faixa } from '../../../models/faixa.model';

@Component({
  selector: 'app-produto-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produto-detail.html',
  styleUrls: ['./produto-detail.css']
})
export class ProdutoDetailComponent implements OnInit {

  produto?: Produto;
  faixas: Faixa[] = [];

  carregando = false;
  mensagemErro = '';

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private carrinhoService: CarrinhoService,
    private listaDesejosService: ListaDesejosService,
    private faixaService: FaixaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);

    if (id) {
      this.carregarProduto(id);
    }
  }

  carregarProduto(id: number): void {
  this.carregando = true;
  this.mensagemErro = '';

  this.produtoService.findAll().subscribe({
    next: (data) => {
      const encontrado = data.find(p => Number(p.id) === Number(id));

      if (!encontrado) {
        this.mensagemErro = 'Produto não encontrado.';
        this.carregando = false;
        this.cdr.detectChanges();
        return;
      }

      this.produto = encontrado;
      this.carregarFaixas(encontrado.album.id);
      this.carregando = false;
      this.cdr.detectChanges();
    },
    error: (err: any) => {
      console.error('Erro ao carregar produto:', err);
      this.mensagemErro = 'Erro ao carregar detalhes do produto.';
      this.carregando = false;
      this.cdr.detectChanges();
    }
  });
}

  getImagem(produto: Produto): string {
  if (produto.album?.capaUrl) {
    return produto.album.capaUrl;
  }

  return `/img/albuns/${produto.album.id}.jpg`;
}

  usarImagemPadrao(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/img/albuns/album-placeholder.jpg';
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

  getFormato(formato: any): string {
    if (!formato) return '';

    if (typeof formato === 'string') return formato;

    if (typeof formato === 'object') {
      return formato.label || formato.nome || formato.name || Object.values(formato).join(' ');
    }

    return String(formato);
  }

  adicionarAoCarrinho(): void {
    if (!this.produto) return;

    if (this.produto.quantidadeEstoque <= 0) {
      alert('Produto sem estoque disponível.');
      return;
    }

    this.carrinhoService.adicionar({
      id: this.produto.id,
      titulo: this.produto.album.titulo,
      preco: this.produto.preco,
      quantidade: 1,
      imagem: this.getImagem(this.produto)
    });

    alert('Produto adicionado ao carrinho!');
  }

  adicionarAListaDesejos(): void {
    if (!this.produto) return;

    this.listaDesejosService.adicionar({
      id: this.produto.id,
      titulo: this.produto.album.titulo,
      preco: this.produto.preco,
      imagem: this.getImagem(this.produto)
    });

    alert('Produto adicionado à lista de desejos!');
  }

  carregarFaixas(idAlbum: number): void {
  this.faixaService.findByAlbum(idAlbum).subscribe({
    next: (data) => {
      this.faixas = data.sort((a, b) => a.numeroFaixa - b.numeroFaixa);
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erro ao carregar faixas:', err);
      this.faixas = [];
      this.cdr.detectChanges();
    }
  });
}
}