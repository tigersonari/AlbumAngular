import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../services/album.service';
import { Album } from '../../../models/album.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './album-list.html',
  styleUrls: ['./album-list.css']
})
export class AlbumListComponent implements OnInit {

  albuns: Album[] = [];
  filtro = '';

  page = 0;
  pageSize = 10;
  total = 0;

  carregando = false;
  mensagemErro = '';

  constructor(
    private service: AlbumService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.service.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.albuns = data;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar álbuns.';
        this.carregando = false;
      }
    });

    this.service.count().subscribe({
      next: (c) => this.total = c,
      error: () => this.total = 0
    });
  }

  pesquisar(): void {
    const termo = this.filtro.trim();

    if (!termo) {
      this.page = 0;
      this.loadData();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    this.service.findByTitulo(termo, this.page, this.pageSize).subscribe({
      next: (data) => {
        this.albuns = data;
        this.total = data.length;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao pesquisar álbum.';
        this.carregando = false;
      }
    });
  }

  excluir(id: number): void {
    if (!confirm('Deseja excluir este álbum?')) return;

    this.service.delete(id).subscribe({
      next: () => this.loadData(),
      error: (err) => {
  console.error(err);
  alert('Não é possível excluir este álbum porque ele possui produtos, faixas ou pedidos relacionados.');
}
    });
  }

  novo(): void {
    this.router.navigate(['/albums/new']);
  }

  getFormato(formato: any): string {
    if (!formato) return '';

    if (typeof formato === 'string') return formato;

    if (typeof formato === 'object') {
      return formato.label || formato.nome || formato.name || Object.values(formato).join(' ');
    }

    return String(formato);
  }

  getProjetos(album: Album): string {
    return album.artistasPrincipais
      ?.map(p => p.nomeArtistico || p.nomeGrupo)
      .join(', ') || 'Sem projetos';
  }

  getGeneros(album: Album): string {
    return album.generos
      ?.map(g => g.nomeGenero)
      .join(', ') || 'Sem gêneros';
  }

  proxima(): void {
    if ((this.page + 1) * this.pageSize >= this.total) return;
    this.page++;
    this.loadData();
  }

  anterior(): void {
    if (this.page > 0) {
      this.page--;
      this.loadData();
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.total / this.pageSize);
  }
}