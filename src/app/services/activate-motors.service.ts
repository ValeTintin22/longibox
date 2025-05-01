import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ActivateMotorsService {
  constructor(private firebaseService: FirebaseService) { }

  /**
   * Envía una solicitud para dispensar productos al ESP32 a través de Firebase
   * @param cartItems - Lista de productos en el carrito
   * @returns Observable con el resultado de la solicitud
   */
  requestProducts(cartItems: Cart[]): Observable<any> {
    // Validar que hay items en el carrito
    if (!cartItems || cartItems.length === 0) {
      return throwError(() => new Error('El carrito está vacío'));
    }
    
    // Convertir los items del carrito al formato necesario para Firebase
    const productRequests = cartItems.map(item => ({
      productId: Number(item.product.id),
      quantity: item.quantity
    }));
    
    console.log('Enviando solicitud de productos:', productRequests);
    
    // Enviar la solicitud a Firebase
    return this.firebaseService.createProductRequest(productRequests).pipe(
      tap(response => console.log('Solicitud enviada correctamente:', response)),
      catchError(error => {
        console.error('Error al enviar la solicitud:', error);
        return throwError(() => new Error('Error al comunicarse con el dispensador'));
      })
    );
  }
}