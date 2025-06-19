import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, PrimeNGModule, RouterModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {
  profileData: any = {};
  isLoggedIn = false;
  newPostCaption: string = '';
  uploadedFile: File | null = null;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile() {
    this.profileService.getCurrentUserProfile().subscribe({
      next: (data) => {
        this.profileData = data.data;
      },
      error: (err) => console.error('Error fetching profile:', err)
    });
  }

  updateProfile() {
    this.profileService.updateProfile(this.profileData).subscribe({
      next: () => console.log('Profile updated successfully'),
      error: (err) => console.error('Profile update failed:', err)
    });
  }

  deletePost(postId: string) {
    this.profileService.deletePost(postId).subscribe({
      next: () => {
        this.profileData.posts = this.profileData.posts.filter((post: { _id: string; }) => post._id !== postId);
      },
      error: (err) => console.error('Post deletion failed:', err)
    });
  }


  updateFile(event: any) {
    this.uploadedFile = event.target.files[0];
  }
  createPost() {
    // const file = event.target.files[0];
    const file = this.uploadedFile;
    if (file) {
      this.profileService.createPost(file, this.newPostCaption).subscribe({
        next: (post) => {
          this.profileData.posts.push(post);
        },
        error: (err) => console.error('Post creation failed:', err)
      });
    }
  }

}
