import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// import { NavbarComponent } from "./components/navbar/navbar.component";
import { PrimeNG } from 'primeng/config';
// import { PrimeNGModule } from './shared/prime-ng/prime-ng.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
// import { MessageService } from 'primeng/api';
// import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  constructor(
    private primeng: PrimeNG,
  ) { }
  
  ngOnInit() {
    this.primeng.ripple.set(true);
  }
  
  title = 'angular-app';
}
