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

  followUser(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/follow/${username}`, {});
  }

  unfollowUser(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/unfollow/${username}`, {});
  }


}
