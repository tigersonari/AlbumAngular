import { Album } from './album.model';

export interface Produto {
  id: number;
  preco: number;
  album: Album;
  quantidadeEstoque: number;
}