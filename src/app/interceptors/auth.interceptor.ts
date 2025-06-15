import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService)
  const router = inject(Router);
  const token = sessionStorage.getItem('accessToken');

  if(token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        snackbar.show('Session expired. Please log in again.', 'X');
        sessionStorage.removeItem('accessToken');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        snackbar.show('You do not have permission to perform this action.', 'X');
      } else if (error.status >= 500) {
        snackbar.show('Server error. Please try again later.', 'X');
      }
      return throwError(() => error);
    })
  );
};
