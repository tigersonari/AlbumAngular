import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  login = '';
  senha = '';

  mostrarSenha = false;

  mensagemErro = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  entrar(): void {
    this.mensagemErro = '';

    if (!this.login || !this.senha) {
      this.mensagemErro = 'Informe login e senha.';
      return;
    }

    this.carregando = true;

    this.authService.login({
      login: this.login,
      senha: this.senha
    }).subscribe({
      next: (usuario) => {
        this.authService.salvarUsuario(usuario);

        if (usuario.perfil === 'ADM') {
          this.router.navigate(['/albums']);
        } else {
          this.router.navigate(['/produtos']);
        }
      },
      error: () => {
        this.mensagemErro = 'Login ou senha inválidos.';
        this.carregando = false;
      }
    });
  }
}