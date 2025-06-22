import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = environment.apiUrl + '/user';

  constructor(private http: HttpClient) { }

  getProfile(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  followUser(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/follow/${username}`, {});
  }

  unfollowUser(username: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/unfollow/${username}`, {});
  }

  getFollowers(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/followers/${username}`);
  }

  getFollowing(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/following/${username}`);
  }

  createPost(file: File, caption: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('postCaption', caption);
    return this.http.post<any>(`${environment.apiUrl}/post`, formData);
  }

  /** Fetch the current user's profile */
  getCurrentUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current`);
  }

  /** Update the user's profile */
  updateProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, data);
  }

  /** Delete a post by its ID */
  deletePost(postId: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/post/${postId}`);
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/${username}`);
  }

}
