// src/app/pages/checkout/checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Order } from '../../models/order.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  currentStep = 1;
  order: Order = {
    userId: 'guest',
    items: [],
    total: 0,
    customer: { name: '', email: '', phone: '' },
    deliveryAddress: { street: '', city: '', postalCode: '', country: 'Tunisia' },
    paymentMethod: 'cash',
    status: 'PENDING',
    createdAt: new Date() // ✅ Ajouté ici
  };

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    const cartItems = this.cartService.getCartItems();
    if (cartItems.length === 0) {
      Swal.fire('Panier vide', 'Ajoutez des voitures avant de passer commande.', 'warning');
      this.router.navigate(['/cart']);
      return;
    }

    this.order.items = cartItems.map(car => ({
      carId: car.id,
      brand: car.brand,
      model: car.model,
      price: car.price,
      quantity: 1
    }));
    this.order.total = this.cartService.getTotalPrice();

    const username = localStorage.getItem('username') || 'guest';
    this.order.userId = username;
  }

  nextStep(): void {
    if (this.isStepValid()) {
      this.currentStep++;
    } else {
      Swal.fire('Erreur', 'Veuillez remplir correctement les champs.', 'error');
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  isStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return !!this.order.customer.name && this.order.customer.email.includes('@');
      case 2:
        return !!this.order.deliveryAddress.street && !!this.order.deliveryAddress.city;
      case 3:
        return !!this.order.paymentMethod;
      default:
        return true;
    }
  }

  confirmOrder(): void {
    console.log('✅ Commande confirmée:', this.order);

    // ✅ Ajoute la date de création
    this.order.createdAt = new Date();

    // ✅ Récupère les commandes existantes
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');

    // ✅ Ajoute la nouvelle commande
    userOrders.push(this.order);

    // ✅ Sauvegarde dans localStorage
    localStorage.setItem('userOrders', JSON.stringify(userOrders));

    // ✅ Vide le panier
    this.cartService.clearCart();

    Swal.fire({
      title: '✅ Commande confirmée !',
      text: 'Merci pour votre achat. Vous serez contacté pour la livraison.',
      icon: 'success',
      confirmButtonText: 'OK',
      background: '#1a1a1a',
      color: 'white'
    });

    // ✅ Redirige vers la page de remerciement
    this.router.navigate(['/thank-you']);
  }
}