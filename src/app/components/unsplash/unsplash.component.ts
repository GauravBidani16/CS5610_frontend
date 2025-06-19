import { Component } from '@angular/core';
import { UnsplashService } from '../../services/unsplash.service';
import { catchError, finalize, of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unsplash',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './unsplash.component.html',
  styleUrl: './unsplash.component.scss'
})
export class UnsplashComponent {
  query: string = ''; // Holds the user's search query
  images: any[] = []; // Stores the fetched image data
  isLoading: boolean = false; // Flag for loading state
  errorMessage: string = ''; // Stores any error messages

  constructor(private unsplashService: UnsplashService) { }

  /**
   * Initiates the image search based on the current query.
   */
  searchImages(): void {
    if (!this.query.trim()) {
      this.errorMessage = 'Please enter a search term.';
      this.images = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.images = []; // Clear previous results

    this.unsplashService.searchPhotos(this.query, 1, 10).subscribe({
      next: (data) => {
        if (data && data.results) {
          this.images = data.results;
          if (this.images.length === 0) {
            this.errorMessage = 'No images found for your search.';
          }
        } else {
          this.errorMessage = 'Unexpected response format.';
        }
      },
      error: (error) => console.log('Error fetching images:', error)
    });

    //   }) // Search for 30 images on the first page
    //     .pipe(
    //       catchError(error => {
    //         this.errorMessage = error.message || 'Failed to fetch images. Check console for details.';
    //         return of(null); // Return an observable with null to prevent breaking the stream
    //       }),
    //       finalize(() => {
    //         this.isLoading = false; // Always set loading to false when the observable completes or errors
    //       })
    //     )
    //     .subscribe(response => {
    //       if (response && response.results) {
    //         this.images = response.results;
    //         if (this.images.length === 0) {
    //           this.errorMessage = 'No images found for your search.';
    //         }
    //       }
    //     });
    // }
  }

}
