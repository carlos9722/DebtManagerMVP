import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  isPosting = signal(false);

  router = inject(Router);
  authService = inject(AuthService);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Completa los campos correctamente');
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }

    const { name = '', email = '', password = '' } = this.registerForm.value;

    this.isPosting.set(true);

    this.authService.register(name!, email!, password!).subscribe({
      next: () => {
        this.isPosting.set(false);
        this.successMessage.set('¡Usuario registrado!');
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        }, 2000);
      },
      error: (message: string) => {
        this.isPosting.set(false);
        this.errorMessage.set(message);
        setTimeout(() => this.errorMessage.set(null), 3000);
      }
    });
  }
}
