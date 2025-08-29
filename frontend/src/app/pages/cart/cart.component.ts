// src/app/pages/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: Car[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  removeFromCart(car: Car): void {
    this.cartService.removeFromCart(car);
    this.loadCart(); // Rafraîchit
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/100x60/333333/ffffff?text=Image+Indisponible';
  }
}