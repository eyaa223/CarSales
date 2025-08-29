// src/app/components/car-card/car-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { Car } from '../../models/car.model';
import { CarService } from '../../services/car.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html'
})
export class CarCardComponent implements OnInit {
  @Input() car!: Car;
  qrCode: string = '';
  isLoadingQr: boolean = true;

  constructor(
    private carService: CarService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQrCode();
  }

  loadQrCode(): void {
    if (this.car && this.car.id) {
      this.carService.getQrCodeImage(this.car.id).subscribe({
        next: (base64) => {
          this.qrCode = base64;
          this.isLoadingQr = false;
        },
        error: (err) => {
          console.error('Erreur QR code', err);
          this.qrCode = '';
          this.isLoadingQr = false;
        }
      });
    }
  }

  addToCart(): void {
    this.cartService.addToCart(this.car);
    alert(`${this.car.brand} ${this.car.model} ajouté au panier !`);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  deleteCar(): void {
    if (confirm(`Voulez-vous vraiment supprimer ${this.car.brand} ${this.car.model} ?`)) {
      this.carService.deleteCar(this.car.id).subscribe(() => {
        window.location.reload();
      });
    }
  }

  getImageUrl(): string {
    return this.car.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
  }
}