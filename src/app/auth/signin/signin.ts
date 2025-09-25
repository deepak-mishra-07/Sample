import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, LoginRequest } from '../auth';

@Component({
  selector: 'app-signin',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.scss'
})
export class Signin {
  signinForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signinForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const credentials: LoginRequest = this.signinForm.value;

      this.authService.signin(credentials).subscribe({
        next: (response) => {
          this.authService.setAuthenticatedUser(response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage.set('Invalid email or password. Please try again.');
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.signinForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName} must be at least 6 characters`;
    }
    return '';
  }
}
