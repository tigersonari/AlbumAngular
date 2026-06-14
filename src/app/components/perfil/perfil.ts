import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { UsuarioLogado } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {

  usuario: UsuarioLogado | null = null;

  nome = '';
  login = '';
  senhaConfirmacao = '';

  senhaAtual = '';
  novaSenha = '';
  confirmarSenha = '';

  mostrarSenhaConfirmacao = false;
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;
  mostrarConfirmarSenha = false;

  mensagemErro = '';
  mensagemSucesso = '';

  email = '';
  telefone = '';

  nomeCard = '';
  emailCard = '';
  telefoneCard = '';

  constructor(
    public authService: AuthService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();

    if (this.usuario) {
      this.nome = this.usuario.nome;
      this.login = this.usuario.login;
    }

    this.http.get<any>('http://localhost:8080/usuarios/me')
      .subscribe({
        next: (dados) => {
          this.nome = dados.nome || '';
          this.login = dados.login || '';
          this.email = dados.email || '';
          this.telefone = dados.telefone || '';

          this.nomeCard = this.nome;
          this.emailCard = this.email;
          this.telefoneCard = this.telefone;

          const usuarioLogado = this.authService.getUsuario();

          if (usuarioLogado) {
            usuarioLogado.nome = this.nome;
            usuarioLogado.login = this.login;
            usuarioLogado.email = this.email;
            usuarioLogado.telefone = this.telefone;

            this.authService.salvarUsuario(usuarioLogado);
            this.usuario = usuarioLogado;
          }

          this.cdr.detectChanges();
        },
        error: () => {
          this.mensagemErro = 'Erro ao carregar dados do perfil.';
        }
      });
  }

  atualizarPerfil(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (!this.nome || !this.login || !this.senhaConfirmacao) {
      this.mensagemErro = 'Preencha nome, login e confirme sua senha.';
      return;
    }

    this.http.put<any>('http://localhost:8080/usuarios/perfil', {
      nome: this.nome,
      login: this.login,
      email: this.email,
      telefone: this.telefone,
      senhaConfirmacao: this.senhaConfirmacao
    }).subscribe({
      next: (usuarioAtualizado) => {
        const usuarioLogado = this.authService.getUsuario();

        if (usuarioLogado) {
          usuarioLogado.nome = usuarioAtualizado.nome;
          usuarioLogado.login = usuarioAtualizado.login;
          usuarioLogado.email = usuarioAtualizado.email;
          usuarioLogado.telefone = usuarioAtualizado.telefone;

          this.authService.salvarUsuario(usuarioLogado);
          this.usuario = usuarioLogado;

          this.nomeCard = this.nome;
          this.emailCard = this.email;
          this.telefoneCard = this.telefone;
        }

        this.senhaConfirmacao = '';
        this.mostrarSenhaConfirmacao = false;
        this.mensagemSucesso = 'Perfil atualizado com sucesso!';

        alert('Perfil atualizado com sucesso!');
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao atualizar perfil. Verifique a senha.';
        alert('Erro ao atualizar perfil. Verifique a senha.');
      }
    });
  }

  alterarSenha(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      this.mensagemErro = 'Preencha todos os campos da alteração de senha.';
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.mensagemErro = 'A nova senha e a confirmação não conferem.';
      return;
    }

    this.http.put('http://localhost:8080/usuarios/alterar-senha', {
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Senha alterada com sucesso!';
        this.senhaAtual = '';
        this.novaSenha = '';
        this.confirmarSenha = '';

        this.mostrarSenhaAtual = false;
        this.mostrarNovaSenha = false;
        this.mostrarConfirmarSenha = false;

        alert('Senha alterada com sucesso!');
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao alterar senha. Verifique a senha atual.';
        alert('Erro ao alterar senha. Verifique a senha atual.');
      }
    });
  }
}