import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { DebtStatistics } from '../interfaces/debt-statistics.interface';
import { CreateDebt, Debt, UpdateDebt } from '../interfaces/debt.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  private http = inject(HttpClient);

  /**
   * Obtiene las estadisticas del dashboard
   */
  getStatistics(): Observable<DebtStatistics> {
    return this.http.get<DebtStatistics>(`${baseUrl}/debts/statistics`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al obtener las estadísticas';
          return throwError(() => message);
        })
      );
  }

  /**
   * Exporta las deudas en el formato especificado (csv o json)
   */
  exportDebts(format: 'csv' | 'json'): Observable<Blob> {
    return this.http.get(`${baseUrl}/debts/export?format=${format}`, {
      responseType: 'blob'
    })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al exportar las deudas';
          return throwError(() => message);
        })
      );
  }

  /**
   * Crea una nueva deuda
   */
  createDebt(debt: CreateDebt): Observable<Debt> {
    return this.http.post<Debt>(`${baseUrl}/debts/create`, debt)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al crear la deuda';
          return throwError(() => message);
        })
      );
  }

  /**
   * Actualiza una deuda existente
   */
  updateDebt(id: string, debt: UpdateDebt): Observable<Debt> {
    return this.http.put<Debt>(`${baseUrl}/debts/update/${id}`, debt)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al actualizar la deuda';
          return throwError(() => message);
        })
      );
  }

  /**
   * Marca una deuda como pagada
   */
  payDebt(id: string): Observable<Debt> {
    return this.http.patch<Debt>(`${baseUrl}/debts/pay/${id}`, {})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al marcar la deuda como pagada';
          return throwError(() => message);
        })
      );
  }

  /**
   * Elimina una deuda
   */
  deleteDebt(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${baseUrl}/debts/delete/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al eliminar la deuda';
          return throwError(() => message);
        })
      );
  }
}

