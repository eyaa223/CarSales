// src/app/pages/home/home.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CarService } from '../../services/car.service';
import { CartService } from '../../services/cart.service';
import { Car } from '../../models/car.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cars: Car[] = [];
  isLoading = true;
  featuredCars: Car[] = [];

  constructor(
    private carService: CarService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe({
      next: (data) => {
        this.cars = data;
        this.featuredCars = data.slice(0, 6);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des voitures', err);
        this.isLoading = false;
      }
    });
  }

  addToCart(car: Car): void {
    this.cartService.addToCart(car);
    alert(`${car.brand} ${car.model} ajoutée au panier !`);
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x250/333333/ffffff?text=Image+Indisponible';
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const header = document.querySelector('.home-header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
}