import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  country = '';
  incomeBracket: 'low' | 'middle' | 'high' | '' = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    this.auth.signup(
      this.name,
      this.email,
      this.password,
      this.country
    ).subscribe({
      next: (result) => {

        if (result.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = result.message || 'Signup failed';
        }

      },

      error: (error) => {
        console.error('Signup error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to connect to server';
      }
    });
  }
}