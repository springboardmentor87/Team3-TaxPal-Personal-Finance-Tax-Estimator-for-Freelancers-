import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {

 email = '';
submitted = false;
message = '';
devResetLink = '';

  onSubmit(): void {
    this.submitted = true;

    this.message =
      'Password reset is currently unavailable. Please contact support.';
  }
}