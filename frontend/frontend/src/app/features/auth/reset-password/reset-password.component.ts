import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  token = '';
  tokenValid = false;
  newPassword = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';

    // Backend password-reset API is not implemented yet.
    this.tokenValid = false;
    this.errorMessage = 'Password reset is currently unavailable.';
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.tokenValid) {
      this.errorMessage = 'Password reset is currently unavailable.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
  }
}