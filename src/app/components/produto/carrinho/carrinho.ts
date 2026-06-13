import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from '../../../services/carrinho.service';
import { ItemCarrinho } from '../../../models/item-carrinho.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './carrinho.html',
  styleUrls: ['./carrinho.css']
})
export class CarrinhoComponent implements OnInit {

  itens: ItemCarrinho[] = [];
  selecionados: number[] = [];
  mensagemErro = '';

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    this.itens = this.carrinhoService.getItens();
    this.selecionados = this.itens.map(i => i.id);
  }

  itemSelecionado(id: number): boolean {
    return this.selecionados.includes(id);
  }

  toggleItem(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selecionados.push(id);
    } else {
      this.selecionados = this.selecionados.filter(i => i !== id);
    }
  }

  totalSelecionado(): number {
    return this.itens
      .filter(item => this.selecionados.includes(item.id))
      .reduce((total, item) => total + item.preco * item.quantidade, 0);
  }

  finalizarCompra(): void {
    this.mensagemErro = '';

    const itensSelecionados = this.itens.filter(item =>
      this.selecionados.includes(item.id)
    );

    if (itensSelecionados.length === 0) {
      this.mensagemErro = 'Selecione pelo menos um item para finalizar a compra.';
      alert(this.mensagemErro);
      return;
    }

    this.carrinhoService.salvarItensCheckout(itensSelecionados);
    this.router.navigate(['/checkout']);
  }

  remover(id: number): void {
    this.carrinhoService.remover(id);
    this.carregarCarrinho();
  }

  limpar(): void {
    this.carrinhoService.limpar();
    this.carregarCarrinho();
  }

  aumentarQuantidade(item: ItemCarrinho): void {
    item.quantidade++;
    this.carrinhoService.salvar(this.itens);
  }

  diminuirQuantidade(item: ItemCarrinho): void {
    if (item.quantidade > 1) {
      item.quantidade--;
      this.carrinhoService.salvar(this.itens);
    }
  }
}