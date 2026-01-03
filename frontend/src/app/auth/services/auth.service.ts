import { HttpClient, HttpErrorResponse  } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from "@auth/interfaces/user.interface";
import { catchError, map, Observable, throwError } from "rxjs";
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _authStatus = signal<AuthStatus>('checking');
    private _user = signal<User | null>(null);
    private _token = signal<string | null>(localStorage.getItem('token'));

    private http = inject(HttpClient);
    private router = inject(Router);

    constructor() {
        this.checkLocalStorage();
    }

    authStatus = computed<AuthStatus>(() => this._authStatus());
    user = computed(() => this._user());
    token = computed(() => this._token());

    login(email: string, password: string): Observable<boolean> {
        return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, {
            email,
            password
        })
        .pipe(
            map((resp) => this.handleAuthSuccess(resp)),
            catchError((err) => this.handleAuthError(err))
        );
    }

    logout() {
        this._user.set(null);
        this._token.set(null);
        this._authStatus.set('not-authenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigateByUrl('/auth/login')
    }

    private checkLocalStorage(): void {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (token && userString) {
            try {
                const user: User = JSON.parse(userString);
                this._user.set(user);
                this._token.set(token);
                this._authStatus.set('authenticated');
            } catch {
                this.logout();
            }
        } else {
            this._authStatus.set('not-authenticated');
        }
    }

    private handleAuthSuccess({ token, user }: AuthResponse): boolean {
        this._user.set(user);
        this._authStatus.set('authenticated');
        this._token.set(token);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return true;
    }

    private handleAuthError(error: HttpErrorResponse): Observable<never> {
        this.logout();
        const message = error.error?.error || error.error?.message || 'Error de autenticación';
        return throwError(() => message);
    }
}