import { Component } from '@angular/core';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  imports: [PrimeNGModule, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  isLoggedIn = false;
  currentUserDetails: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activate();
  }

  activate() {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUserDetails = this.authService.getUserDetails();
  }

  navigateToPage(path: string) {
    if(path !== "") {
      this.router.navigate([`/${path}`])
    }
  }

}
