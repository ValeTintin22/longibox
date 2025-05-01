import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Cart, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ActivateMotorsService {
  // Mapeo de productos a motores (producto.id -> número de motor)
  private productToMotorMap: Record<number, number> = {
    1: 1, // Producto con ID 1 activará el motor 1
    2: 2, // Producto con ID 2 activará el motor 2
    3: 3, // Producto con ID 3 activará el motor 3
    4: 4, // Producto con ID 4 activará el motor 4
    5: 5, // Producto con ID 5 activará el motor 5
    6: 6  // Producto con ID 6 activará el motor 6
    // Añadir más mapeos según sea necesario
  };

  constructor(private firebaseService: FirebaseService) { }

  /**
   * Procesa los productos seleccionados y activa los motores correspondientes
   * @param products - Lista de productos en el carrito
   * @returns Observable con el resultado de la activación
   */
  activateMotorsForProducts(products: { product: Product, quantity: number }[]): Observable<any> {
    // Determinar qué motores activar basado en los productos
    const motorsToActivate: number[] = [];
    
    products.forEach(item => {
      const productId = Number(item.product.id);
      const motorIndex = this.productToMotorMap[productId];
      
      if (motorIndex) {
        // Si un producto tiene cantidad > 1, solo activamos el motor una vez
        // ya que el ESP32 entregará la cantidad programada
        if (!motorsToActivate.includes(motorIndex)) {
          motorsToActivate.push(motorIndex);
        }
      }
    });
    
    console.log('Motores a activar:', motorsToActivate);
    
    // Si no hay motores para activar, no hacemos nada
    if (motorsToActivate.length === 0) {
      return new Observable(observer => {
        observer.next({ success: false, message: 'No hay motores para activar' });
        observer.complete();
      });
    }
    
    // Activar los motores en Firebase y luego resetear después de un tiempo
    return this.firebaseService.activateMotors(motorsToActivate).pipe(
      switchMap(response => {
        // Esperar 10 segundos antes de resetear los motores
        // Esto da tiempo al ESP32 para leer y procesar los datos
        return timer(10000).pipe(
          switchMap(() => this.firebaseService.resetMotors())
        );
      })
    );
  }

  requestProducts(cartItems: Cart[]): Observable<any> {
    // Convertir los items del carrito al formato necesario para Firebase
    const productRequests = cartItems.map(item => ({
      productId: Number(item.product.id),
      quantity: item.quantity
    }));
    
    console.log('Enviando solicitud de productos:', productRequests);
    
    // Ya no activamos motores directamente, solo enviamos la solicitud
    return this.firebaseService.activateProductRequests(productRequests);
  }
}