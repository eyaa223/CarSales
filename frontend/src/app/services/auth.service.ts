// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly ROLE_KEY = 'userRole';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/auth/login', { username, password }).pipe(
      tap(response => {
        if (response.token && response.role) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.ROLE_KEY, response.role);
        }
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/auth/register', {
      username,
      email,
      password
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    this.router.navigate(['/']); // ✅ Redirige vers landing page
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.ROLE_KEY) === 'ADMIN';
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }
}