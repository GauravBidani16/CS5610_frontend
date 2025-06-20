import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UnsplashService } from '../../services/unsplash.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';

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
            console.log('No Results', `No images found for "${query}".`);
          } else {
            console.log('Success', `Found ${response.results.length} images for "${query}".`);
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
              console.log('Showing Random Photos', 'No search query provided. Enjoy these random images!');
          } else {
              console.log('No Random Photos', 'Could not load random images at this time.');
          }
        }
      });
  }
}
