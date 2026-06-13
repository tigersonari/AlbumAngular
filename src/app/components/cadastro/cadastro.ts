import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent {

  nome = '';
  login = '';
  senha = '';
  email = '';
  telefone = '';

  mensagemErro = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  cadastrar(): void {
    this.mensagemErro = '';

    if (!this.nome || !this.login || !this.senha || !this.email || !this.telefone) {
      this.mensagemErro = 'Preencha todos os campos.';
      alert(this.mensagemErro);
      return;
    }

    if (this.telefone.length !== 11) {
      this.mensagemErro = 'O telefone deve ter 11 dígitos.';
      alert(this.mensagemErro);
      return;
    }

    this.carregando = true;

    this.authService.cadastrar({
      nome: this.nome,
      login: this.login,
      senha: this.senha,
      email: this.email,
      telefone: this.telefone
    }).subscribe({
      next: () => {
  this.authService.login({
    login: this.login,
    senha: this.senha
  }).subscribe({
    next: (usuarioLogado) => {
      this.authService.salvarUsuario(usuarioLogado);

      alert('Cadastro realizado com sucesso! Você já está logado.');
      this.router.navigate(['/produtos']);
    },
    error: (err: any) => {
      console.error(err);
      this.mensagemErro = 'Cadastro realizado, mas não foi possível fazer login automático.';
      alert(this.mensagemErro);
      this.router.navigate(['/login']);
    }
  });
},
      error: (err: any) => {
        console.error(err);
        this.mensagemErro = 'Erro ao cadastrar usuário.';
        alert(this.mensagemErro);
        this.carregando = false;
      }
    });
  }
}