import { Component, OnInit } from '@angular/core';
import { ParticipacaoService } from '../../../services/participacao.service';
import { Participacao } from '../../../models/participacao.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-participacao-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './participacao-list.html',
  styleUrls: ['./participacao-list.css']
})
export class ParticipacaoListComponent implements OnInit {

  participacoes: Participacao[] = [];
  filtro = '';

  carregando = false;
  mensagemErro = '';

  constructor(
    private service: ParticipacaoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.service.findAll().subscribe({
      next: (data) => {
        this.participacoes = data;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar participações.';
        this.carregando = false;
      }
    });
  }

  pesquisar(): void {
    const termo = this.filtro.trim();

    if (!termo) {
      this.loadData();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.service.findByPapel(termo).subscribe({
      next: (data) => {
        this.participacoes = data;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Erro ao pesquisar participação.';
        this.carregando = false;
      }
    });
  }

  getParticipantes(p: any): string {
    return p.participantes
      ?.map((x: any) => x.nomeArtistico || x.nomeGrupo)
      .join(', ') || 'Sem participantes';
  }

  excluir(id: number): void {
    if (!confirm('Deseja excluir esta participação?')) {
      return;
    }

    this.service.delete(id).subscribe({
      next: () => this.loadData(),
      error: () => this.mensagemErro = 'Erro ao excluir participação.'
    });
  }

  novo(): void {
    this.router.navigate(['/participacoes/new']);
  }
}