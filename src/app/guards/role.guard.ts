import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';


export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const role = authService.getUserRole();
  if (!role || role !== 'admin') { // Adjust based on required roles
    router.navigate(['/login']);
    return false;
  }

  return true;
};
