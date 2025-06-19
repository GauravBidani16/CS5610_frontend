import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import * as _ from 'lodash';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, PrimeNGModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  username!: string;
  profileData: any = {};
  isLoggedIn = false;
  isFollowing = false;
  canViewPosts = false;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.isLoggedIn = this.authService.isAuthenticated();
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';

    this.loadProfile();
  }
  loadProfile() {
    this.profileService.getProfile(this.username).subscribe({
      next: (data) => {
        this.profileData = {
          ...data.data.user,
          followerCount: data.data.followerCount,
          followingCount: data.data.followingCount,
          postCount: data.data.postCount,
          posts: data.data.posts
        };

        this.isFollowing = this.profileData.followers.includes(this.authService.getUsername());
        this.canViewPosts = this.profileData.role === 'PUBLIC_USER' || this.isFollowing || this.isAdmin;
      },
      error: (err) => console.error('Error fetching profile:', err)
    });
  }

  followUser() {
    this.profileService.followUser(this.username).subscribe({
      next: () => {
        this.isFollowing = true;
        this.profileData.followers.push(this.authService.getUsername());
      },
      error: (err) => console.error('Follow failed:', err)
    });
  }

  unfollowUser() {
    this.profileService.unfollowUser(this.username).subscribe({
      next: () => {
        this.isFollowing = false;
        this.profileData.followers = this.profileData.followers.filter((user: string | null) => user !== this.authService.getUsername());
      },
      error: (err) => console.error('Unfollow failed:', err)
    });
  }

}
