// src/app/models/order.model.ts
export interface Order {
  id?: number;
  userId: string;
  items: OrderItem[];
  total: number;
  customer: Customer;
  deliveryAddress: Address;
  paymentMethod: 'cash' | 'card';
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED';
  createdAt?: Date;
}

export interface OrderItem {
  carId: number;
  brand: string;
  model: string;
  price: number;
  quantity: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}