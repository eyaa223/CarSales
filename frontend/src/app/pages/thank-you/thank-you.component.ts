// src/app/pages/thank-you/thank-you.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent {
  constructor(private router: Router) {}

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToMyOrders(): void {
    this.router.navigate(['/my-orders']);
  }
}