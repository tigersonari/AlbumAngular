export interface ItemPedidoRequest {
  idProduto: number;
  quantidade: number;
}

export interface EnderecoRequest {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface PedidoRequest {
  idEnderecoEntrega?: number;
  endereco?: EnderecoRequest;
  observacao?: string;
  codigoCupom?: string;
  itens: ItemPedidoRequest[];
  pagamento: {
    metodoPagamento: 'PIX' | 'BOLETO' | 'CARTAO';
    idCartaoSalvo?: number;
    numeroCartao?: string;
    nomeImpresso?: string;
    validade?: string;
  };
}

export interface PedidoResponse {
  id: number;
  dataCriacao: string;
  total: number;
  status: string;
  observacao: string;
  endereco: any;
  itens: any[];
  pagamento: any;
  codigoCupom?: string;
  valorDesconto?: number;
}