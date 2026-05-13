export class Grupo {
  id!: number;
  nomeGrupo!: string;
  dataInicio!: string;
  dataTermino?: string;

  empresa!: {
    id: number;
    nomeEmpresa: string;
  };

  membros!: {
    id: number;
    nomeArtistico: string;
  }[];
}