import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DebtorService } from '../../services/debtor.service';
import { Debtor, CreateDebtor } from '../../interfaces/debtor.interface';
import { DebtorsTableComponent } from '../../components/debtors-table/debtors-table.component';
import { DebtorFormComponent } from '../../components/debtor-form/debtor-form.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-debtors-page',
  imports: [DebtorsTableComponent, DebtorFormComponent, ConfirmDialogComponent],
  templateUrl: './debtors-page.component.html',
})
export class DebtorsPageComponent implements OnInit {
  private debtorService = inject(DebtorService);
  private destroyRef = inject(DestroyRef);

  debtors = signal<Debtor[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  showForm = signal<boolean>(false);
  editingDebtor = signal<Debtor | null>(null);
  showConfirmDialog = signal<boolean>(false);
  debtorToDelete = signal<Debtor | null>(null);

  ngOnInit(): void {
    this.loadDebtors();
  }

  /**
   * Carga la lista de deudores
   */
  loadDebtors(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.debtorService.getDebtors()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.debtors.set(data);
          this.isLoading.set(false);
        },
        error: (message: string) => {
          this.isLoading.set(false);
          this.errorMessage.set(message);
          setTimeout(() => this.errorMessage.set(null), 5000);
        }
      });
  }

  /**
   * Abre el formulario para crear un nuevo deudor
   */
  openCreateForm(): void {
    this.editingDebtor.set(null);
    this.showForm.set(true);
  }

  /**
   * Abre el formulario para editar un deudor
   */
  handleEdit(debtor: Debtor): void {
    this.editingDebtor.set(debtor);
    this.showForm.set(true);
  }

  /**
   * Maneja la eliminación de un deudor
   */
  handleDelete(debtor: Debtor): void {
    this.debtorToDelete.set(debtor);
    this.showConfirmDialog.set(true);
  }

  /**
   * Confirma la eliminación del deudor
   */
  confirmDelete(): void {
    const debtor = this.debtorToDelete();
    if (!debtor) return;

    this.debtorService.deleteDebtor(debtor.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showConfirmDialog.set(false);
          this.debtorToDelete.set(null);
          this.loadDebtors();
        },
        error: (message: string) => {
          this.showConfirmDialog.set(false);
          this.debtorToDelete.set(null);
          this.errorMessage.set(message);
          setTimeout(() => this.errorMessage.set(null), 5000);
        }
      });
  }

  /**
   * Cancela la eliminación
   */
  cancelDelete(): void {
    this.showConfirmDialog.set(false);
    this.debtorToDelete.set(null);
  }

  /**
   * Maneja el envío del formulario (crear o actualizar)
   */
  handleFormSubmit(debtorData: CreateDebtor): void {
    const editingDebtor = this.editingDebtor();

    if (editingDebtor) {
      // Actualizar
      this.debtorService.updateDebtor(editingDebtor.id, debtorData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.showForm.set(false);
            this.editingDebtor.set(null);
            this.loadDebtors();
          },
          error: (message: string) => {
            this.errorMessage.set(message);
            setTimeout(() => this.errorMessage.set(null), 5000);
          }
        });
    } else {
      // Crear
      this.debtorService.createDebtor(debtorData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.showForm.set(false);
            this.loadDebtors();
          },
          error: (message: string) => {
            this.errorMessage.set(message);
            setTimeout(() => this.errorMessage.set(null), 5000);
          }
        });
    }
  }

  /**
   * Cancela el formulario
   */
  handleFormCancel(): void {
    this.showForm.set(false);
    this.editingDebtor.set(null);
  }
}

