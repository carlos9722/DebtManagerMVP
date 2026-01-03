import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  imports: [NgClass],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  isOpen = input.required<boolean>();
  title = input<string>('Confirmar acción');
  message = input.required<string>();
  confirmText = input<string>('Confirmar');
  cancelText = input<string>('Cancelar');
  confirmButtonClass = input<string>('btn-error');

  onConfirm = output<void>();
  onCancel = output<void>();

  handleConfirm(): void {
    this.onConfirm.emit();
  }

  handleCancel(): void {
    this.onCancel.emit();
  }
}

