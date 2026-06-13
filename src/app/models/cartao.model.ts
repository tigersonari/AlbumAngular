export interface CartaoSalvo {
  id: number;
  nomeTitular: string;
  validade: string;
  ultimos4: string;
  bandeira?: string;
}

export interface NovoCartao {
  nomeTitular: string;
  numero: string;
  validade: string;
  bandeira: string;
}