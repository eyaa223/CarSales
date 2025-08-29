// src/app/components/navbar/navbar.component.ts
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd, Event } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showBackButton = false;

  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.showBackButton = event.url !== '/' && event.url !== '/home';
    });
  }

  goBack() {
    this.location.back();
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}