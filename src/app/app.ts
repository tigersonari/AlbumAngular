import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('hello-world');

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isAdmin(): boolean {
    return this.authService.getUsuario()?.perfil === 'ADM';
  }

  isUser(): boolean {
    return this.authService.getUsuario()?.perfil === 'USER';
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  sidebarAberta = false;

toggleSidebar(): void {
  this.sidebarAberta = !this.sidebarAberta;
}

fecharSidebar(): void {
  this.sidebarAberta = false;
}

irHome(): void {
  this.router.navigate(['/produtos']);
  this.fecharSidebar();
}
}