import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DebtorService } from '../../services/debtor.service';
import { DebtService } from '../../services/debt.service';
import { DebtorWithDebts } from '../../interfaces/debtor.interface';
import { Debt } from '../../interfaces/debt.interface';
import { DebtsTableComponent } from '../../components/debts-table/debts-table.component';
import { DebtFormComponent } from '../../components/debt-form/debt-form.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

type FilterType = 'all' | 'pending' | 'paid';

@Component({
  selector: 'app-debtor-debts-page',
  imports: [DebtsTableComponent, DebtFormComponent, ConfirmDialogComponent, RouterLink],
  templateUrl: './debtor-debts-page.component.html',
})
export class DebtorDebtsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private debtorService = inject(DebtorService);
  private debtService = inject(DebtService);
  private destroyRef = inject(DestroyRef);

  debtorId = signal<string>('');
  debtor = signal<DebtorWithDebts | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  // Filtro
  filter = signal<FilterType>('all');
  
  // Deudas filtradas
  filteredDebts = computed(() => {
    const debts = this.debtor()?.debts || [];
    const currentFilter = this.filter();
    
    if (currentFilter === 'pending') {
      return debts.filter(d => !d.isPaid);
    }
    if (currentFilter === 'paid') {
      return debts.filter(d => d.isPaid);
    }
    return debts;
  });
  
  // Contadores
  pendingCount = computed(() => (this.debtor()?.debts || []).filter(d => !d.isPaid).length);
  paidCount = computed(() => (this.debtor()?.debts || []).filter(d => d.isPaid).length);
  
  // Formulario
  showForm = signal<boolean>(false);
  editingDebt = signal<Debt | null>(null);
  
  // Diálogos de confirmación
  showDeleteDialog = signal<boolean>(false);
  debtToDelete = signal<Debt | null>(null);
  showPayDialog = signal<boolean>(false);
  debtToPay = signal<Debt | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('debtorId');
    if (!id) {
      this.router.navigate(['/debt/debtors']);
      return;
    }
    this.debtorId.set(id);
    this.loadDebtorWithDebts();
  }

  /**
   * Carga el deudor con sus deudas
   */
  loadDebtorWithDebts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.debtorService.getDebtorById(this.debtorId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.debtor.set(data);
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
   * Abre el formulario para crear una nueva deuda
   */
  openCreateForm(): void {
    this.editingDebt.set(null);
    this.showForm.set(true);
  }

  /**
   * Abre el formulario para editar una deuda
   */
  handleEdit(debt: Debt): void {
    this.editingDebt.set(debt);
    this.showForm.set(true);
  }

  /**
   * Muestra el diálogo de confirmación de eliminación
   */
  handleDelete(debt: Debt): void {
    this.debtToDelete.set(debt);
    this.showDeleteDialog.set(true);
  }

  /**
   * Muestra el diálogo de confirmación de pago
   */
  handlePay(debt: Debt): void {
    this.debtToPay.set(debt);
    this.showPayDialog.set(true);
  }

  /**
   * Confirma la eliminación de la deuda
   */
  confirmDelete(): void {
    const debt = this.debtToDelete();
    if (!debt) return;

    this.debtService.deleteDebt(debt.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showDeleteDialog.set(false);
          this.debtToDelete.set(null);
          this.successMessage.set('Deuda eliminada correctamente');
          setTimeout(() => this.successMessage.set(null), 3000);
          this.loadDebtorWithDebts();
        },
        error: (message: string) => {
          this.showDeleteDialog.set(false);
          this.debtToDelete.set(null);
          this.errorMessage.set(message);
          setTimeout(() => this.errorMessage.set(null), 5000);
        }
      });
  }

  /**
   * Cancela la eliminación
   */
  cancelDelete(): void {
    this.showDeleteDialog.set(false);
    this.debtToDelete.set(null);
  }

  /**
   * Confirma el pago de la deuda
   */
  confirmPay(): void {
    const debt = this.debtToPay();
    if (!debt) return;

    this.debtService.payDebt(debt.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.showPayDialog.set(false);
          this.debtToPay.set(null);
          this.successMessage.set('Deuda marcada como pagada');
          setTimeout(() => this.successMessage.set(null), 3000);
          this.loadDebtorWithDebts();
        },
        error: (message: string) => {
          this.showPayDialog.set(false);
          this.debtToPay.set(null);
          this.errorMessage.set(message);
          setTimeout(() => this.errorMessage.set(null), 5000);
        }
      });
  }

  /**
   * Cancela el pago
   */
  cancelPay(): void {
    this.showPayDialog.set(false);
    this.debtToPay.set(null);
  }

  /**
   * Maneja el envío del formulario (crear o actualizar)
   */
  handleFormSubmit(data: { description: string; amount: number; dueDate?: string }): void {
    const editingDebt = this.editingDebt();

    if (editingDebt) {
      // Actualizar
      this.debtService.updateDebt(editingDebt.id, data)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.showForm.set(false);
            this.editingDebt.set(null);
            this.successMessage.set('Deuda actualizada correctamente');
            setTimeout(() => this.successMessage.set(null), 3000);
            this.loadDebtorWithDebts();
          },
          error: (message: string) => {
            this.errorMessage.set(message);
            setTimeout(() => this.errorMessage.set(null), 5000);
          }
        });
    } else {
      // Crear
      this.debtService.createDebt({
        ...data,
        debtorId: this.debtorId(),
      })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.showForm.set(false);
            this.successMessage.set('Deuda creada correctamente');
            setTimeout(() => this.successMessage.set(null), 3000);
            this.loadDebtorWithDebts();
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
    this.editingDebt.set(null);
  }

  /**
   * Cambia el filtro de deudas
   */
  setFilter(filter: FilterType): void {
    this.filter.set(filter);
  }
}

