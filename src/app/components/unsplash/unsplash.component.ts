import { Component } from '@angular/core';
import { UnsplashService } from '../../services/unsplash.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-unsplash',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './unsplash.component.html',
  styleUrl: './unsplash.component.scss'
})
export class UnsplashComponent {
  query: string = '';
  images: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private unsplashService: UnsplashService,
    private snackbarService: SnackbarService
  ) { }

  searchImages(): void {
    if (!this.query.trim()) {
      this.errorMessage = 'Please enter a search term.';
      this.images = [];
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.images = [];

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
      error: (error) => this.snackbarService.showToast("Error fetching images", "Error", "error")

    });
  }

}
