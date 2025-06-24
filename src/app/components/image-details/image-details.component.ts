import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UnsplashService } from '../../services/unsplash.service';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-image-details',
  imports: [RouterModule, PrimeNGModule],
  templateUrl: './image-details.component.html',
  styleUrl: './image-details.component.scss'
})
export class ImageDetailsComponent {

  query: string = '';
  imageDetails: any = {};
  isLoading: boolean = false;
  routeSubscription!: Subscription;
  isLoggedIn: boolean = false;
  currentUserDetails: any = {};
  unsplashComments: any[] = [];
  commentText: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private unsplashService: UnsplashService,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUserDetails = this.authService.getUserDetails();

    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const urlQuery = params.get('query');
      if (urlQuery) {
        this.query = decodeURIComponent(urlQuery);
        this.searchById(this.query);
        if (this.isLoggedIn) {
          this.fetchCurrentImageDetails(this.query);
        }
      } else {
        this.router.navigate(['/search'])
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  searchById(pictureId: string) {
    this.unsplashService.getPhotoById(pictureId)
      .subscribe((response: any) => {
        if (response) {
          this.imageDetails = response
        }
      })
  }

  fetchCurrentImageDetails(pictureId: string) {
    this.unsplashService.getAllInteractionsByUnsplashId(pictureId)
      .subscribe((response: any) => {
        if (response) {
          this.unsplashComments = response.data;
        }
      })
  }

  addComment() {
    this.unsplashService.createInteraction(this.query, this.commentText)
      .subscribe({
        next: (response) => {
          if (response) {
            this.unsplashComments.push({
              ...response.data,
              user: this.currentUserDetails
            })
            this.commentText = '';
          }
        },
        error: (err) => console.error("Error while creating the interaction", err)  
    })
  }
}
