import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private apiUrl = environment.unsplashApiUrl;
  private accessKey = environment.unsplashAccessKey;

  constructor(private http: HttpClient) {
    if (!this.accessKey && !environment.production) {
      console.warn('Unsplash Access Key is missing! Please add it to your environment.ts file.');
    }
  }

  searchPhotos(query: string, page: number = 1, perPage: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('client_id', this.accessKey);

    return this.http.get<any>(`${this.apiUrl}/search/photos`, { params });
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 401) {
        errorMessage = 'Unauthorized: Please check your Unsplash Access Key.';
      } else if (error.status === 403) {
        errorMessage = 'Forbidden: Rate limit exceeded or invalid permissions.';
      } else if (error.status === 404) {
        errorMessage = 'Not Found: The requested resource could not be found.';
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage)); // Rethrow as a new error
  }
}
