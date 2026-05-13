export class Album {
  id!: number;
  titulo!: string;
  descricao!: string;
  lancamento!: string;

  formato!: number; // ENUM

  idProducao!: number;

  idsProjetos: number[] = []; // N:N

  //ver como vai ficar faixas e generos (falar com professor para tirar dúvida)
}