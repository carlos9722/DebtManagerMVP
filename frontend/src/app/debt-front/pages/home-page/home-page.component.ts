import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DebtService } from '../../services/debt.service';
import { DebtStatistics } from '../../interfaces/debt-statistics.interface';
import { StatisticsCardComponent } from '../../components/statistics-card/statistics-card.component';

@Component({
  selector: 'app-home-page',
  imports: [StatisticsCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  debtService = inject(DebtService);
  destroyRef = inject(DestroyRef);

  statistics = signal<DebtStatistics | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  isExporting = signal<{ csv: boolean; json: boolean }>({ csv: false, json: false });

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.debtService.getStatistics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.statistics.set(data);
          this.isLoading.set(false);
        },
        error: (message: string) => {
          this.isLoading.set(false);
          this.errorMessage.set(message);
          setTimeout(() => this.errorMessage.set(null), 5000);
        }
      });
  }


  exportDebts(format: 'csv' | 'json') {
    const isExportingKey = format as 'csv' | 'json';
    this.isExporting.update(state => ({ ...state, [isExportingKey]: true }));
    this.errorMessage.set(null);

    this.debtService.exportDebts(format).subscribe({
      next: (blob) => {
        this.isExporting.update(state => ({ ...state, [isExportingKey]: false }));

        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `deudas.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (message: string) => {
        this.isExporting.update(state => ({ ...state, [isExportingKey]: false }));
        this.errorMessage.set(message);
        setTimeout(() => this.errorMessage.set(null), 5000);
      }
    });
  }
}
