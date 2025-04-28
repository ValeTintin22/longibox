import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CartComponent } from './components/cart/cart.component';

register();

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'qr-scanner', component: QrScannerComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'checkout', component: CheckoutComponent },
  //Users
  { path: 'users', component: UserListComponent },
  { path: 'user-form', component: UserFormComponent },
  { path: 'user-form/:id', component: UserFormComponent },
  { path: '**', redirectTo: '' },
  { path: 'cart', component: CartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
