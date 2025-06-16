import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth/login';
  private refreshUrl = environment.apiUrl + '/auth/refresh';
  private registerUrl = environment.apiUrl + '/auth/register';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<{ data: { accessToken: string } }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ data: { accessToken: string } }>(this.apiUrl, { username, password }, { headers })
      .pipe(
        tap(response => this.storeToken(response.data.accessToken)),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Authentication error'));
        })
      );
  }

  register(formData: FormData): Observable<{ message: string; data?: any }> {
    const headers = new HttpHeaders({ 'Accept': 'application/json' });

    return this.http.post<{ message: string; data?: any }>(this.registerUrl, formData, { headers })
      .pipe(
        catchError(error => {
          console.error('Registration failed:', error);
          return throwError(() => new Error(error.error?.message || 'Registration error'));
        })
      );
  }

  storeToken(token: string) {
    sessionStorage.setItem('accessToken', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  refreshToken(): Observable<{ data: { accessToken: string } }> {
    return this.http.post<{ data: { accessToken: string } }>(this.refreshUrl, {});
  }

  logout() {
    sessionStorage.removeItem('accessToken');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.username;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
}
