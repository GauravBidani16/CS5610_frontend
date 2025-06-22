import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { NavbarComponent } from "./components/navbar/navbar.component";
import { PrimeNG } from 'primeng/config';
// import { PrimeNGModule } from './shared/prime-ng/prime-ng.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SnackbarService } from './services/snackbar.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {

  constructor(
    private primeng: PrimeNG,
    private snackBarService: SnackbarService,
    private messageService: MessageService
  ) { }
  
  ngOnInit() {
    this.snackBarService.showToast$.subscribe((toast) => {
      if(toast?.detail) {
        this.messageService.add(toast);
      }
    });
    this.primeng.ripple.set(true);
  }
  
  title = 'angular-app';
}
