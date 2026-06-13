import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

function getRoles(route: ActivatedRouteSnapshot): string[] {
  const roles = route.data?.['roles'];

  if (Array.isArray(roles)) {
    return roles;
  }

  return [];
}

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const usuario = authService.getUsuario();

  if (!usuario) {
    return router.createUrlTree(['/login']);
  }

  const roles = getRoles(route);

  if (roles.length === 0) {
    return true;
  }

  if (roles.includes(usuario.perfil)) {
    return true;
  }

  return router.createUrlTree(['/produtos']);
};