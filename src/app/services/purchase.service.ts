import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private cartItems: Cart[] = [];

  constructor() {}

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(item => item.product.name === product.name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({  product, quantity: 1 });
    }
  }

  removeFromCart(nameProduct: String): void {
    this.cartItems = this.cartItems.filter(item => item.product.name !== nameProduct);
  }

  getCartItems(): Cart[] {
    return this.cartItems;
  }

  clearCart(): void {
    this.cartItems = [];
  }
}
