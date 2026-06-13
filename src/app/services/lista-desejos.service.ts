import { Injectable } from '@angular/core';
import { ItemDesejo } from '../models/item-desejo.model';

@Injectable({
  providedIn: 'root'
})
export class ListaDesejosService {

  private getStorageKey(): string {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    return `listaDesejos_${usuario.id}`;
  }

  getItens(): ItemDesejo[] {
    const dados = localStorage.getItem(this.getStorageKey());
    return dados ? JSON.parse(dados) : [];
  }

  adicionar(item: ItemDesejo): void {
    const itens = this.getItens();

    const existe = itens.some(i => i.id === item.id);

    if (!existe) {
      itens.push(item);
      localStorage.setItem(this.getStorageKey(), JSON.stringify(itens));
    }
  }

  remover(id: number): void {
    const itens = this.getItens().filter(i => i.id !== id);
    localStorage.setItem(this.getStorageKey(), JSON.stringify(itens));
  }

  limpar(): void {
    localStorage.removeItem(this.getStorageKey());
  }

  existe(id: number): boolean {
    return this.getItens().some(i => i.id === id);
  }
}