import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const expiration = decodedToken.exp * 1000; // Convert to milliseconds

    if (Date.now() >= expiration) {
      sessionStorage.removeItem('accessToken'); // Remove expired token
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    console.error('Invalid token:', error);
    sessionStorage.removeItem('accessToken');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
