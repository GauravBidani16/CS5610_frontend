import { Component } from '@angular/core';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { UnsplashService } from '../../services/unsplash.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-saved-pictures',
  imports: [PrimeNGModule],
  templateUrl: './saved-pictures.component.html',
  styleUrl: './saved-pictures.component.scss'
})
export class SavedPicturesComponent {

  isLoggedIn: boolean = false;
  currentUserDetails: any = {};
  images: any[] = [];

  constructor(
    private authService: AuthService,
    private unsplashService: UnsplashService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUserDetails = this.authService.getUserDetails();

    if (this.isLoggedIn && this.currentUserDetails) {
      this.unsplashService.getAllInteractionsByUser(this.currentUserDetails._id)
        .subscribe({
          next: (response) => {
            if(response && response.data) {
              const deduplicated = this.unsplashService.filterByProperty(response.data, "unsplashId")
              const savedImageUnsplashIds = deduplicated.map((obj) => obj.unsplashId)

              this.unsplashService.getPhotosByIds(savedImageUnsplashIds)
                .subscribe({
                  next: (res) => {
                    if(res) {
                      this.images = res;
                    }
                  }
                })
            }
          },
          error: (err) => console.error("Error fetching unsplash images for current user", err)
        })
    }
  }

  redirectToDetailsPage(pictureId: string) {
    if (pictureId) {
      this.router.navigate([`/details/${pictureId}`])
    }
  }

  redirectToLoginPage() {
    this.router.navigate(['/login'])
  }
}
