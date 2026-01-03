import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  errorMessage = signal<string | null>(null);
  isPosting = signal(false);

  router = inject(Router);
  authService = inject(AuthService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Completa los campos correctamente');
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;

    this.isPosting.set(true);

    this.authService.login(email!, password!).subscribe({
      next: (isAuthenticated) => {
        this.isPosting.set(false);
        if (isAuthenticated) {
          this.router.navigateByUrl('/');
        }
      },
      error: (message: string) => {
        this.isPosting.set(false);
        this.errorMessage.set(message);
        setTimeout(() => this.errorMessage.set(null), 3000);
      }
    });
  }
}