import { Component, OnInit } from '@angular/core';
import { ListaDesejosService } from '../../services/lista-desejos.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { ItemDesejo } from '../../models/item-desejo.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-desejos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-desejos.html',
  styleUrls: ['./lista-desejos.css']
})
export class ListaDesejosComponent implements OnInit {

  itens: ItemDesejo[] = [];

  constructor(
    private listaDesejosService: ListaDesejosService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.itens = this.listaDesejosService.getItens();
  }

  remover(id: number): void {
    this.listaDesejosService.remover(id);
    this.carregar();
  }

  adicionarAoCarrinho(item: ItemDesejo): void {
    this.carrinhoService.adicionar({
      id: item.id,
      titulo: item.titulo,
      preco: item.preco,
      quantidade: 1,
      imagem: item.imagem
    });

    alert('Produto adicionado ao carrinho!');
  }
}