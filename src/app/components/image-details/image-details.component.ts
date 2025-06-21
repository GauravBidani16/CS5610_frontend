import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UnsplashService } from '../../services/unsplash.service';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';

@Component({
  selector: 'app-image-details',
  imports: [PrimeNGModule],
  templateUrl: './image-details.component.html',
  styleUrl: './image-details.component.scss'
})
export class ImageDetailsComponent {

  query: string = '';
  imageDetails: any = {};
  isLoading: boolean = false;
  routeSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private unsplashService: UnsplashService,
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.paramMap.subscribe(params => {
      const urlQuery = params.get('query');
      if (urlQuery) {
        this.query = decodeURIComponent(urlQuery);
        this.searchById(this.query);
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
        console.log("PhotoById", response);
      }
    })
  }
}
