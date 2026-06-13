export class Faixa {
  id!: number;
  titulo!: string;
  numeroFaixa!: number;
  duracao!: number;
  idioma!: string;

  tipoVersao!: string;

  album?: {
    id: number;
    titulo: string;
  };

  genero?: {
    id: number;
    nomeGenero: string;
  };

  composicao?: {
    id: number;
    data: string;
  };

  participacoes?: any[];
}