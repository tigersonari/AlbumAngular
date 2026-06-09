export class Participacao {
  id!: number;
  papel!: string;
  destaque!: boolean;

  participantes?: {
    id: number;
    nomeArtistico?: string;
    nomeGrupo?: string;
  }[];
}