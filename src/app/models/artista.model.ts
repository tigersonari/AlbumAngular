export class Artista {
  id!: number;
  nomeCompleto!: string;
  nomeArtistico!: string;
  dataNascimento!: string;
  nacionalidade!: string;
  funcaoPrincipal!: string;

  empresa!: {
    id: number;
    nomeEmpresa: string;
  };
}