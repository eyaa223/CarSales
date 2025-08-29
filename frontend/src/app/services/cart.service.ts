// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Car } from '../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_KEY = 'cart_';

  constructor(private authService: AuthService) {}

  private getUserCartKey(): string {
    const username = this.authService.getUserRole();
    return this.CART_KEY + (username || 'guest');
  }

  addToCart(car: Car): void {
    const key = this.getUserCartKey();
    const cart = this.getCartItems();
    if (!cart.some(item => item.id === car.id)) {
      cart.push(car);
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }

  removeFromCart(car: Car): void {
    const key = this.getUserCartKey();
    const cart = this.getCartItems().filter(item => item.id !== car.id);
    localStorage.setItem(key, JSON.stringify(cart));
  }

  clearCart(): void {
    const key = this.getUserCartKey();
    localStorage.removeItem(key);
  }

  getCartItems(): Car[] {
    const key = this.getUserCartKey();
    const cart = localStorage.getItem(key);
    return cart ? JSON.parse(cart) : [];
  }

  getTotalPrice(): number {
    return this.getCartItems().reduce((total, car) => total + car.price, 0);
  }
}