import { Component } from '@angular/core';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, PrimeNGModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  providers: [ConfirmationService]
})
export class AdminComponent {
  userData: any = [];

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.activate();
  }

  activate() {
    if (!this.authService.isAuthenticated() && this.authService.getUserRole() !== "ADMIN") {
      this.router.navigate(['/home']);
    }
    this.profileService.getAllUsers()
      .subscribe({
        next: (data) => {
          this.userData = data.data;
          // this.profileData.posts.push(post.data);
        },
        error: (err) => {
          if (err.status === 403) {
            this.authService.logout();
            this.activate();
          }
          console.error('Error Fetching all users.', err)
        }
      });
  }

  redirectToProfile(username: string) {
    this.router.navigate([`/profile/${username}`]);
  }

  confirmDelete(username: string) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this profile?',
            header: 'Delete',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger',
            },

            accept: () => {
              this.deleteUser(username);
            },
            reject: () => {
            },
        });
    }

  deleteUser(username: string) {
    this.profileService.deleteUser(username).subscribe({
      next: (data) => {
        this.userData = this.userData.filter((user: any) => user.username !== data.data.username);
        this.snackbarService.showToast('User profile deleted');
      },
      error: (err) => this.snackbarService.showToast('Error deleting the user', "Error", "error")
    });
  }

}
