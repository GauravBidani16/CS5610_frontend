import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, PrimeNGModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  loginForm = new FormGroup({
    usernameFC: new FormControl('', Validators.required),
    passwordFC: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onLoginClick() {
    if (this.loginForm.valid) {
      const loginObject = {
        username: this.loginForm.value.usernameFC,
        password: this.loginForm.value.passwordFC
      }
      this.authService.login(loginObject?.username!, loginObject?.password!).subscribe({
        next: (response) => {
          this.authService.storeToken(response?.data?.accessToken);
          this.snackbarService.showToast('Login successful');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

}
