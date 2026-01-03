import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { DebtStatistics } from '../interfaces/debt-statistics.interface';

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
}

