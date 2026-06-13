import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-esqueci-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './esqueci-senha.html',
  styleUrls: ['./esqueci-senha.css']
})
export class EsqueciSenhaComponent {

  email = '';
  tokenGerado = '';
  mensagemErro = '';
  mensagemSucesso = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  solicitar(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    this.tokenGerado = '';

    if (!this.email) {
      this.mensagemErro = 'Informe seu e-mail.';
      alert(this.mensagemErro);
      return;
    }

    this.http.post<any>('http://localhost:8080/usuarios/esqueci-senha', {
      email: this.email
    }).subscribe({
      next: (res) => {
        this.mensagemSucesso = res.mensagem;
        this.tokenGerado = res.token;

        this.cdr.detectChanges();

        alert('Token de recuperação gerado com sucesso!');
      },
      error: (err) => {
        this.mensagemErro =
          err.error?.message ||
          err.error?.detail ||
          'Erro ao solicitar recuperação de senha.';

          this.cdr.detectChanges();

        alert(this.mensagemErro);
      }
    });
  }
}