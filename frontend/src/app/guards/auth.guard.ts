// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      const expectedRole = route.data['expectedRole'] as string;
      const userRole = this.authService.getUserRole();

      if (expectedRole && userRole !== expectedRole) {
        this.router.navigate(['/home']); // ✅ Redirige les users vers home
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']); // ✅ Déconnecté → login
      return false;
    }
  }
}