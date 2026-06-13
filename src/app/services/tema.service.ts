import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TemaService {

  private chave = 'temaAlbumMix';

  iniciarTema(): void {
    const temaSalvo = localStorage.getItem(this.chave) || 'dark';
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(`${temaSalvo}-theme`);
  }

  alternarTema(): void {
    const temaAtual = document.body.classList.contains('light-theme')
      ? 'light'
      : 'dark';

    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';

    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(`${novoTema}-theme`);

    localStorage.setItem(this.chave, novoTema);
  }

  temaAtual(): 'dark' | 'light' {
    return document.body.classList.contains('light-theme') ? 'light' : 'dark';
  }
}