// src/app/components/car-details/car-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../../services/car.service';
import { CartService } from '../../services/cart.service';
import { Car } from '../../models/car.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null;
  qrCode: string = '';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.loadCar(id);
  }

  loadCar(id: number): void {
    this.carService.getCarById(id).subscribe({
      next: (data) => {
        this.car = data;
        this.loadQrCode(id);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur de chargement', err);
        this.isLoading = false;
        this.showError('Erreur', 'Impossible de charger les détails du véhicule.');
      }
    });
  }

  loadQrCode(carId: number): void {
    this.carService.getQrCodeImage(carId).subscribe({
      next: (base64) => {
        this.qrCode = base64;
      },
      error: (err) => {
        console.error('Erreur QR code', err);
        this.qrCode = '';
      }
    });
  }

  addToCart(): void {
    if (this.car) {
      this.cartService.addToCart(this.car);
      this.showSuccess('Ajouté au panier', `${this.car.brand} ${this.car.model} a été ajouté à votre panier !`);
    }
  }

  showSuccess(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#e63946',
      background: '#1a1a1a',
      color: 'white',
      iconColor: '#4CAF50',
      confirmButtonText: 'OK'
    });
  }

  showError(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#e63946',
      background: '#1a1a1a',
      color: 'white',
      iconColor: '#e63946',
      confirmButtonText: 'OK'
    });
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/600x400/333333/ffffff?text=Image+Indisponible';
  }
}