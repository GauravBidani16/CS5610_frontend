import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsplashService } from '../../services/unsplash.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, PrimeNGModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  query: string = '';
  images: any[] = [];
  isLoading: boolean = false;
  routeSubscription!: Subscription;
  currentMode: 'random' | 'search' = 'random';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private unsplashService: UnsplashService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const urlQuery = params.get('query');
      if (urlQuery) {
        this.currentMode = 'search';
        this.query = decodeURIComponent(urlQuery);
        this.performQuerySearch(this.query);
      } else {
        this.currentMode = 'random';
        this.query = '';
        this.fetchRandomPhotos();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  onSearchSubmit(): void {
    const trimmedQuery = this.query.trim();

    if (trimmedQuery) {
      this.router.navigate(['/search', trimmedQuery]);
    } else {
      this.router.navigate(['/search']);
    }
  }

  private performQuerySearch(query: string): void {
    this.isLoading = true;
    this.images = [];

    this.unsplashService.searchPhotos(query, 1, 30)
      .subscribe(response => {
        if (response && response.results) {
          this.images = response.results;
          if (this.images.length === 0) {
            this.snackbarService.showToast(`No images found for "${query}"`, "Warn", "warn");
          } else {
            this.snackbarService.showToast(`Images retrieved successfully for "${query}"`);
          }
        }
      });
  }


  private fetchRandomPhotos(): void {
    this.isLoading = true;
    this.images = [];

    this.unsplashService.getPhotos(1, 30)
      .subscribe(response => {
        if (response) {
          this.images = response;
          if (this.images.length > 0) {
            this.isLoading = false;
          }
        }
      });
  }

  searchById(pictureId: string) {
    this.unsplashService.getPhotoById(pictureId).subscribe(response => {
      if (response) {
        // console.log("PhotoById", response);
      }
    })
  }

  redirectToDetailsPage(pictureId: string) {
    if (pictureId) {
      this.router.navigate([`/details/${pictureId}`])
    }
  }
}
