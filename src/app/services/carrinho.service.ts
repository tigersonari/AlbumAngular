import { Injectable } from '@angular/core';
import { ItemCarrinho } from '../models/item-carrinho.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private getStorageKey(): string {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  return `carrinho_${usuario.id}`;
}

  getItens(): ItemCarrinho[] {
    const dados = localStorage.getItem(this.getStorageKey());

    if (!dados) {
      return [];
    }

    return JSON.parse(dados);
  }

  salvar(itens: ItemCarrinho[]): void {
    localStorage.setItem(
      this.getStorageKey(),
      JSON.stringify(itens)
    );
  }

  adicionar(item: ItemCarrinho): void {

    const itens = this.getItens();

    const existente = itens.find(
      i => i.id === item.id
    );

    if (existente) {
      existente.quantidade++;
    } else {
      itens.push(item);
    }

    this.salvar(itens);
  }

  remover(id: number): void {
    const itens = this.getItens()
      .filter(i => i.id !== id);

    this.salvar(itens);
  }

  limpar(): void {
    localStorage.removeItem(this.getStorageKey());
  }

  total(): number {
    return this.getItens()
      .reduce(
        (total, item) =>
          total + (item.preco * item.quantidade),
        0
      );
  }

  quantidadeItens(): number {
    return this.getItens()
      .reduce(
        (total, item) =>
          total + item.quantidade,
        0
      );
  }

  salvarItensCheckout(itens: ItemCarrinho[]): void {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  localStorage.setItem(`checkout_${usuario.id}`, JSON.stringify(itens));
}

getItensCheckout(): ItemCarrinho[] {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  const dados = localStorage.getItem(`checkout_${usuario.id}`);
  return dados ? JSON.parse(dados) : [];
}

limparItensCheckout(): void {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
  localStorage.removeItem(`checkout_${usuario.id}`);
}

removerItensComprados(itensComprados: ItemCarrinho[]): void {
  const idsComprados = itensComprados.map(i => i.id);

  const restantes = this.getItens().filter(
    item => !idsComprados.includes(item.id)
  );

  this.salvar(restantes);
}
}