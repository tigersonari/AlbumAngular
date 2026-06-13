import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './redefinir-senha.html',
  styleUrls: ['./redefinir-senha.css']
})
export class RedefinirSenhaComponent implements OnInit {

  token = '';
  novaSenha = '';
  confirmarSenha = '';

  mensagemErro = '';
  mensagemSucesso = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
  }

  redefinir(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (!this.token || !this.novaSenha || !this.confirmarSenha) {
      this.mensagemErro = 'Preencha todos os campos.';
      this.cdr.detectChanges();
      alert(this.mensagemErro);
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.mensagemErro = 'As senhas não conferem.';
      this.cdr.detectChanges();
      alert(this.mensagemErro);
      return;
    }

    this.http.post<any>('http://localhost:8080/usuarios/redefinir-senha', {
      token: this.token,
      novaSenha: this.novaSenha
    }).subscribe({
      next: () => {
        this.mensagemSucesso = 'Senha redefinida com sucesso!';
        alert(this.mensagemSucesso);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.mensagemErro =
          err.error?.message ||
          err.error?.detail ||
          'Erro ao redefinir senha.';

        alert(this.mensagemErro);
      }
    });
  }
}