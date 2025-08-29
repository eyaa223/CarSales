// src/app/pages/my-orders/my-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private router: Router) {} 

  ngOnInit(): void {
    const ordersJson = localStorage.getItem('userOrders');
    this.orders = ordersJson ? JSON.parse(ordersJson) : [];
  }

  getTotalPrice(order: Order): number {
    return order.items.reduce((total, item) => total + item.price, 0);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}