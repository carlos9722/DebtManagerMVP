import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';
import { CreateDebtor, Debtor, DebtorWithDebts, UpdateDebtor } from '../interfaces/debtor.interface';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class DebtorService {
  private http = inject(HttpClient);

  /**
   * Obtiene la lista de todos los deudores
   */
  getDebtors(): Observable<Debtor[]> {
    return this.http.get<Debtor[]>(`${baseUrl}/debtors/list`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al obtener los deudores';
          return throwError(() => message);
        })
      );
  }

  /**
   * Obtiene un deudor por su ID con sus deudas
   */
  getDebtorById(id: string): Observable<DebtorWithDebts> {
    return this.http.get<DebtorWithDebts>(`${baseUrl}/debtors/listById/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al obtener el deudor';
          return throwError(() => message);
        })
      );
  }

  /**
   * Crea un nuevo deudor
   */
  createDebtor(debtor: CreateDebtor): Observable<Debtor> {
    return this.http.post<Debtor>(`${baseUrl}/debtors/create`, debtor)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al crear el deudor';
          return throwError(() => message);
        })
      );
  }

  /**
   * Actualiza un deudor existente
   */
  updateDebtor(id: string, debtor: Omit<UpdateDebtor, 'id'>): Observable<Debtor> {
    return this.http.put<Debtor>(`${baseUrl}/debtors/update/${id}`, debtor)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al actualizar el deudor';
          return throwError(() => message);
        })
      );
  }

  /**
   * Elimina un deudor
   */
  deleteDebtor(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${baseUrl}/debtors/delete/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const message = error.error?.message || 'Error al eliminar el deudor';
          return throwError(() => message);
        })
      );
  }
}

