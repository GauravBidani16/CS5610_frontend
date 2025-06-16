import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, PrimeNGModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  username!: string;
  profileData: any;
  isLoggedIn = false;
  canViewPosts = false;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.isLoggedIn = this.authService.isAuthenticated();

    this.profileService.getProfile(this.username).subscribe({
      next: (data) => {
        this.profileData = {
          ...data.data.user,
          followerCount: data.data.followerCount,
          followingCount: data.data.followingCount,
          postCount: data.data.postCount,
        }

        this.canViewPosts = this.isLoggedIn &&
          (data.isPublic || this.authService.getUsername() === this.username || data.followers.includes(this.authService.getUsername()));
      },
      error: (err) => console.error('Error fetching profile:', err)
    });
  }

  unfollowUser() {
    this.profileService.unfollowUser(this.username).subscribe({
      next: () => {
        this.profileData.followers = this.profileData.followers.filter((user: string | null) => user !== this.authService.getUsername());
      },
      error: (err) => console.error('Unfollow failed:', err)
    });
  }

}
