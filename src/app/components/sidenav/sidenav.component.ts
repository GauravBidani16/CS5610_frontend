import { Component } from '@angular/core';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';

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
    private router: Router,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      this.activate();
    });

  }

  activate() {
    // this.isLoggedIn = this.authService.isAuthenticated();
    this.currentUserDetails = this.authService.getUserDetails();
  }

  logout() {
    this.authService.logout();
    this.snackbarService.showToast("Logged out!")
    this.router.navigate(['/home'])
  }

  navigateToPage(path: string) {
    if(path !== "") {
      this.router.navigate([`/${path}`])
    }
  }

}
