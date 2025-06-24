import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {
  private apiUrl = environment.unsplashApiUrl;
  private unsplashLocalUrl = environment.apiUrl + '/unsplash';
  private accessKey = environment.unsplashAccessKey;

  constructor(private http: HttpClient) {
    if (!this.accessKey && !environment.production) {
      console.warn('Unsplash Access Key is missing! Please add it to your environment.ts file.');
    }
  }

  searchPhotos(query: string, page: number = 1, perPage: number = 30): Observable<any> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('client_id', this.accessKey);

    return this.http.get<any>(`${this.apiUrl}/search/photos`, { params });
  }

  getPhotos(page: number = 1, perPage: number = 30): Observable<any[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('client_id', this.accessKey);

    return this.http.get<any[]>(`${this.apiUrl}/photos`, { params });
  }

  getPhotoById(pictureId: string): Observable<any[]> {
    let params = new HttpParams()
      .set('client_id', this.accessKey);

    return this.http.get<any[]>(`${this.apiUrl}/photos/${pictureId}`, { params });
  }

  getPhotosByIds(pictureIds: string[]): Observable<any[]> {
    const photoRequests = pictureIds.map(id => this.getPhotoById(id));
    return forkJoin(photoRequests);
  }


  createInteraction(unsplashId: string, comment: string): Observable<any> {
    return this.http.post<any>(`${this.unsplashLocalUrl}`, { unsplashId, comment });
  }

  getUserInteractionsByUnsplashId(unsplashId: string): Observable<any> {
    return this.http.get<any>(`${this.unsplashLocalUrl}/mine/${unsplashId}`);
  }

  getAllInteractionsByUnsplashId(unsplashId: string): Observable<any> {
    return this.http.get<any>(`${this.unsplashLocalUrl}/all/${unsplashId}`);
  }

  getAllInteractionsByUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.unsplashLocalUrl}/user/${userId}`);
  }

  filterByProperty(data: any[], propertyName: string) {
    const seen = new Set();
    const deduplicated = data.filter(item => {
      if (seen.has(item[propertyName])) return false;
      seen.add(item.unsplashId);
      return true;
    });
    return deduplicated;
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
