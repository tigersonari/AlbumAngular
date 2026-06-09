export class Producao {
  id!: number;
  produtor!: string;
  engenheiroGravacao!: string;
  engenheiroMixagem!: string;
  engenheiroMasterizacao!: string;
  dataProducao!: string;

  idEmpresa?: number;

  empresa?: {
    id: number;
    nomeEmpresa: string;
  };
}