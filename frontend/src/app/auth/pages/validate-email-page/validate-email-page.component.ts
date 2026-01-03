import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

type ValidationStatus = 'validating' | 'success' | 'error';

@Component({
  selector: 'app-validate-email-page',
  imports: [RouterLink],
  templateUrl: './validate-email-page.component.html',
})
export class ValidateEmailPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  status = signal<ValidationStatus>('validating');
  message = signal<string>('');

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.status.set('error');
      this.message.set('Token no proporcionado');
      return;
    }

    this.authService.validateEmail(token).subscribe({
      next: (response) => {
        this.status.set('success');
        this.message.set(response.message);
      },
      error: (errorMessage: string) => {
        this.status.set('error');
        this.message.set(errorMessage);
      }
    });
  }
}
