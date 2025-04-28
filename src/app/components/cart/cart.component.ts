import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { Cart, Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CartComponent {
  cartItems: Cart[] = [];

  constructor(private cartService: PurchaseService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }

  incrementQuantity(item: Cart): void {
    item.quantity += 1;
  }

  decrementQuantity(item: Cart): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.cartService.removeFromCart(item.product.name);
      this.cartItems = this.cartService.getCartItems();
    }
  }

  removeItem(name: String): void {
    this.cartService.removeFromCart(name);
    this.cartItems = this.cartService.getCartItems();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
  }
}
