import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Debt } from '../../interfaces/debt.interface';

@Component({
  selector: 'app-debt-form',
  imports: [ReactiveFormsModule],
  templateUrl: './debt-form.component.html',
})
export class DebtFormComponent {
  fb = inject(FormBuilder);
  debt = input<Debt | null>(null);

  onSubmit = output<{ description: string; amount: number; dueDate?: string }>();
  onCancel = output<void>();

  debtForm = this.fb.group({
    description: ['', [Validators.required, Validators.minLength(3)]],
    amount: [0, [Validators.required, Validators.min(0)]],
    dueDate: [''],
  });

  constructor() {
    effect(() => {
      const debtValue = this.debt();
      if (debtValue) {
        this.debtForm.patchValue({
          description: debtValue.description,
          amount: parseFloat(debtValue.amount),
          dueDate: debtValue.dueDate ? debtValue.dueDate.split('T')[0] : '',
        });
      } else {
        this.debtForm.reset({ amount: 0 });
      }
    });
  }

  handleSubmit(): void {
    if (this.debtForm.invalid) {
      this.debtForm.markAllAsTouched();
      return;
    }

    const formValue = this.debtForm.value;
    this.onSubmit.emit({
      description: formValue.description!,
      amount: formValue.amount!,
      dueDate: formValue.dueDate || undefined,
    });
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  getFieldError(fieldName: string): string | null {
    const field = this.debtForm.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return null;
    }

    if (field.errors['required']) {
      return 'Este campo es obligatorio';
    }
    if (field.errors['minlength']) {
      return `Debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['min']) {
      return 'El monto no puede ser negativo';
    }

    return null;
  }
}

