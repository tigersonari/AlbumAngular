import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnderecoService } from '../../services/endereco.service';
import { Endereco } from '../../models/endereco.model';

@Component({
  selector: 'app-enderecos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './enderecos.html',
  styleUrls: ['./enderecos.css']
})
export class EnderecosComponent implements OnInit {

  enderecos: Endereco[] = [];
  mensagemErro = '';

  novoEndereco: Endereco = {
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: ''
  };

  constructor(private enderecoService: EnderecoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregar();
  }

  getIdUsuario(): number {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado') || '{}');
    return Number(usuario.id);
  }

  carregar(): void {
    this.enderecoService.listarDoUsuario(this.getIdUsuario()).subscribe({
      next: (data) => {
        this.enderecos = data;
        this.cdr.detectChanges();
      },
      error: () => this.mensagemErro = 'Erro ao carregar endereços.'
    });
  }
 
  salvar(): void {
    this.mensagemErro = '';

    if (!this.novoEndereco.rua || !this.novoEndereco.numero || !this.novoEndereco.bairro ||
        !this.novoEndereco.cidade || !this.novoEndereco.uf || !this.novoEndereco.cep) {
      this.mensagemErro = 'Preencha os campos obrigatórios.';
      return;
    }

    this.novoEndereco.uf = this.novoEndereco.uf.toUpperCase();

    this.enderecoService.criar(this.novoEndereco).subscribe({
      next: () => {
        this.novoEndereco = {
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: '',
          cep: ''
        };

        this.carregar();
      },
      error: () => this.mensagemErro = 'Erro ao cadastrar endereço.'
    });
  }

  excluir(id?: number): void {
    if (!id) return;

    if (!confirm('Deseja excluir este endereço?')) return;

    this.enderecoService.deletar(id).subscribe({
      next: () => this.carregar(),
      error: () => this.mensagemErro = 'Erro ao excluir endereço.'
    });
  }
}