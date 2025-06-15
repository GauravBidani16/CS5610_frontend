import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { PrimeNGModule } from '../../shared/prime-ng/prime-ng.module';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, PrimeNGModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  public roles = ["PUBLIC_USER", "PRIVATE_USER"];
  
  constructor(
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private router: Router
  ) { }
  
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('PUBLIC_USER', Validators.required), // Default role: 'user'
    bio: new FormControl('', Validators.maxLength(500)),
    file: new FormControl<File | null>(null, Validators.required)
  });

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.registerForm.patchValue({ file: file });
  }


  onRegisterClick() {
    if (this.registerForm.valid) {
      const { username, firstname, lastname, email, password, confirmPassword, role, bio, file } = this.registerForm.value;

      if (password !== confirmPassword) {
        this.snackbarService.show('Passwords do not match');
        console.error('Passwords do not match');
        return;
      }

      const formData = new FormData();
      formData.append('username', username!);
      formData.append('firstname', firstname!);
      formData.append('lastname', lastname!);
      formData.append('email', email!);
      formData.append('password', password!);
      formData.append('role', role!);
      formData.append('bio', bio!);
      if (file) {
        formData.append('file', file)
      } else {
        this.snackbarService.show('Profile picture is required');
      }

      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Registration successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.snackbarService.show('Registration failed: Please try again later');
          console.error('Registration failed:', err);
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
