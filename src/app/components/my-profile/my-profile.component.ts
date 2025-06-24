import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule, PrimeNGModule, RouterModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  providers: [DialogService],
})
export class MyProfileComponent {
  profileData: any = {};
  isLoggedIn = false;
  newPostCaption: string = '';
  uploadedFile: File | null = null;
  ref: DynamicDialogRef | undefined;
  currentUserDetails: any = {};
  users: any = []
  responsiveOptions: any[] | undefined;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
    public dialogService: DialogService,
    private snackBarService: SnackbarService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUserDetails = this.authService.getUserDetails();

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
    this.getAllUsers();

    this.responsiveOptions = [
      {
        breakpoint: '1200px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '992px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '576px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  loadProfile() {
    this.profileService.getCurrentUserProfile().subscribe({
      next: (data) => {
        this.profileData = data.data;
      },
      error: (err) => {
        console.error('Error fetching profile:', err)
        this.authService.logout();
      }
    });
  }

  updateProfile(updatedProfileData: any) {
    this.profileService.updateProfile(updatedProfileData).subscribe({
      next: () => {
        this.profileData = { ...this.profileData, ...updatedProfileData };
        this.snackBarService.showToast("Profile information updated successfully")
      },
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
    this.uploadedFile = event.files[0];
  }

  clearFile() {
    this.uploadedFile = null
  }

  createPost() {
    const file = this.uploadedFile;
    if (file) {
      this.profileService.createPost(file, this.newPostCaption).subscribe({
        next: (post) => {
          this.profileData.posts.push(post.data);
          this.uploadedFile = null;
          this.newPostCaption = "";
          this.snackBarService.showToast("New post added successfully");
        },
        error: (err) => console.error('Post creation failed:', err)
      });
    }
  }

  getAllUsers() {
    this.profileService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (err) => console.error('Fetching all users failed.', err)
    });
  }

  show() {
    this.ref = this.dialogService.open(UpdateProfileComponent, {
      header: 'Update user profile',
      width: '50vw',
      modal: true,
      closable: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: {
        currentUserData: this.profileData,
      }
    });

    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        const updatedProfileData = { ...data };
        this.updateProfile(updatedProfileData);
      }
    });
  }

}
