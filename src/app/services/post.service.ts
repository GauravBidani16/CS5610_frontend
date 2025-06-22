import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postUrl = environment.apiUrl + '/post';
  private commentUrl = environment.apiUrl + '/comment';

  constructor(private http: HttpClient) { }

  getPublicPosts(): Observable<any> {
    return this.http.get<any>(`${this.postUrl}/public`);
  }

  getFeedPosts() :Observable<any> {
    return this.http.get<any>(`${this.postUrl}/feed`)
  }

  likePost(postId: string): Observable<any> {
    return this.http.post<any>(`${this.postUrl}/${postId}/like`, {});
  }

  addComment(postId: string, text: string): Observable<any> {
    return this.http.post<any>(`${this.commentUrl}/${postId}`, { text });
  }
}
