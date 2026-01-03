import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateDebtor, Debtor } from '../../interfaces/debtor.interface';

@Component({
  selector: 'app-debtor-form',
  imports: [ReactiveFormsModule],
  templateUrl: './debtor-form.component.html',
})
export class DebtorFormComponent {
  fb = inject(FormBuilder);
  debtor = input<Debtor | null>(null);

  // eventos
  onSubmit = output<CreateDebtor>();
  onCancel = output<void>();

  debtorForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]],
    phone: [''],
    notes: [''],
  });

  constructor() {
    // Reaccionar a cambios
    effect(() => {
      const debtorValue = this.debtor();
      if (debtorValue) {
        this.debtorForm.patchValue({
          name: debtorValue.name,
          email: debtorValue.email || '',
          phone: debtorValue.phone || '',
          notes: debtorValue.notes || '',
        });
      } else {
        this.debtorForm.reset();
      }
    });
  }

  handleSubmit(): void {
    if (this.debtorForm.invalid) {
      this.debtorForm.markAllAsTouched();
      return;
    }

    const formValue = this.debtorForm.value;
    const debtorData: CreateDebtor = {
      name: formValue.name!,
      email: formValue.email || undefined,
      phone: formValue.phone || undefined,
      notes: formValue.notes || undefined,
    };

    this.onSubmit.emit(debtorData);
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  getFieldError(fieldName: string): string | null {
    const field = this.debtorForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return null;
    }

    if (field.errors['required']) {
      return 'Este campo es obligatorio';
    }
    if (field.errors['minlength']) {
      return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['email']) {
      return 'El correo electrónico no es válido';
    }

    return null;
  }
}

