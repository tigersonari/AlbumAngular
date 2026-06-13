import { Component, OnInit } from '@angular/core';
import { CarrinhoService } from '../../services/carrinho.service';
import { ItemCarrinho } from '../../models/item-carrinho.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { PedidoBackendService } from '../../services/pedido-backend.service';
import { EnderecoService } from '../../services/endereco.service';
import { Endereco } from '../../models/endereco.model';
import { CartaoService } from '../../services/cartao.service';
import { CartaoSalvo, NovoCartao } from '../../models/cartao.model';
import { PedidoRequest } from '../../models/pedido-backend.model';
import { CupomService, CupomResponse } from '../../services/cupom.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {

  itens: ItemCarrinho[] = [];
  enderecos: Endereco[] = [];
  cartoes: CartaoSalvo[] = [];

  cartaoSelecionado: number | null = null;
  usarNovoCartao = false;

  codigoCupom = '';
  cupomAplicado: CupomResponse | null = null;

  novoCartao: NovoCartao = {
    nomeTitular: '',
    numero: '',
    validade: '',
    bandeira: 'VISA'
  };

  enderecoSelecionado: number | null = null;

  novoEndereco: Endereco = {
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: ''
  };

  formaPagamento: 'PIX' | 'BOLETO' | 'CARTAO' | '' = '';

  pagamentos = [
  { label: 'PIX', value: 'PIX' },
  { label: 'Boleto', value: 'BOLETO' },
  { label: 'Cartão de crédito', value: 'CARTAO' }
];

  mensagemErro = '';
  carregando = false;

  constructor(
    private carrinhoService: CarrinhoService,
    private pedidoService: PedidoBackendService,
    private enderecoService: EnderecoService,
    private cartaoService: CartaoService,
    private cupomService: CupomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itens = this.carrinhoService.getItensCheckout();

if (this.itens.length === 0) {
  this.itens = this.carrinhoService.getItens();
}
    this.carregarEnderecos();
    this.carregarCartoes();
  }

  total(): number {
  return this.itens.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );
}

  getIdUsuario(): number {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    return Number(usuario.id);
  }

  carregarEnderecos(): void {
    this.enderecoService.listarDoUsuario(this.getIdUsuario()).subscribe({
      next: (data) => this.enderecos = data,
      error: () => this.mensagemErro = 'Erro ao carregar endereços.'
    });
  }

  adicionarEndereco(): void {
    this.mensagemErro = '';

    if (!this.novoEndereco.rua || !this.novoEndereco.numero || !this.novoEndereco.bairro ||
        !this.novoEndereco.cidade || !this.novoEndereco.uf || !this.novoEndereco.cep) {
      this.mensagemErro = 'Preencha os dados do novo endereço.';
      return;
    }

    this.novoEndereco.uf = this.novoEndereco.uf.toUpperCase();

    this.enderecoService.criar(this.novoEndereco).subscribe({
      next: (enderecoCriado) => {
        this.enderecos.push(enderecoCriado);
        this.enderecoSelecionado = enderecoCriado.id!;

        this.novoEndereco = {
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: '',
          cep: ''
        };
      },
      error: () => this.mensagemErro = 'Erro ao cadastrar endereço.'
    });
  }

  finalizarCompra(): void {
  this.mensagemErro = '';

  if (this.itens.length === 0) {
    this.mensagemErro = 'Seu carrinho está vazio.';
    return;
  }

  if (!this.enderecoSelecionado) {
    this.mensagemErro = 'Selecione ou cadastre um endereço.';
    return;
  }

  if (!this.formaPagamento) {
    this.mensagemErro = 'Selecione uma forma de pagamento.';
    return;
  }

  const pagamento: any = {
    metodoPagamento: this.formaPagamento
  };

  if (this.formaPagamento === 'CARTAO') {
    if (this.cartaoSelecionado && !this.usarNovoCartao) {
      pagamento.idCartaoSalvo = this.cartaoSelecionado;
    } else {
      if (!this.novoCartao.nomeTitular || !this.novoCartao.numero || !this.novoCartao.validade) {
        this.mensagemErro = 'Preencha os dados do cartão.';
        return;
      }

      pagamento.numeroCartao = this.novoCartao.numero;
      pagamento.nomeImpresso = this.novoCartao.nomeTitular;
      pagamento.validade = this.novoCartao.validade;
    }
  }

  const pedido: PedidoRequest = {
    idEnderecoEntrega: Number(this.enderecoSelecionado),
    observacao: this.cupomAplicado
  ? `Compra realizada pelo sistema. Cupom aplicado: ${this.cupomAplicado.codigo}. Desconto: R$ ${this.valorDesconto().toFixed(2)}`
  : 'Compra realizada pelo sistema',
  codigoCupom: this.cupomAplicado?.codigo || undefined,
    itens: this.itens.map(item => ({
      idProduto: Number(item.id),
      quantidade: Number(item.quantidade)
    })),
    pagamento
  };

  this.carregando = true;

  this.pedidoService.criar(pedido).subscribe({
    next: (resposta) => {
      const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');

      localStorage.setItem(
        `ultimoPedido_${usuario.id}`,
        JSON.stringify(resposta)
      );

      this.carrinhoService.removerItensComprados(this.itens);
      this.carrinhoService.limparItensCheckout();

      alert('Pedido criado com sucesso!');
      this.router.navigate(['/resumo-compra']);
    },
    error: (err: any) => {
      console.error(err);
      this.mensagemErro = err.error?.message || 'Erro ao finalizar compra.';
      this.carregando = false;
    }
  });
}

  carregarCartoes(): void {
  this.cartaoService.listar().subscribe({
    next: (data) => this.cartoes = data,
    error: () => console.log('Erro ao carregar cartões')
  });
}

totalComDesconto(): number {
  return this.cupomAplicado?.totalComDesconto ?? this.total();
}

valorDesconto(): number {
  return this.cupomAplicado?.valorDesconto ?? 0;
}

aplicarCupom(): void {
  this.mensagemErro = '';

  if (!this.codigoCupom.trim()) {
    this.mensagemErro = 'Informe o código do cupom.';
    return;
  }

  this.cupomService.validar(this.codigoCupom, this.total()).subscribe({
    next: (res) => {
      this.cupomAplicado = res;
      this.codigoCupom = res.codigo;
      alert(res.mensagem);
    },
    error: (err) => {
      this.cupomAplicado = null;
      this.mensagemErro =
        err.error?.message ||
        err.error?.detail ||
        'Cupom inválido.';

      alert(this.mensagemErro);
    }
  });
}

removerCupom(): void {
  this.cupomAplicado = null;
  this.codigoCupom = '';
}

}