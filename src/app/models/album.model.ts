export interface Album {
  id: number;
  titulo: string;
  descricao: string;
  lancamento: string;
  capaUrl?: string;

  formato: any;

  producao?: {
    id: number;
    produtor: string;
  };

  artistasPrincipais?: {
    id: number;
    nomeArtistico?: string;
    nomeGrupo?: string;
  }[];

  generos?: {
    id: number;
    nomeGenero: string;
  }[];
}