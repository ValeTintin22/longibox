import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly databaseUrl = 'https://longibox-96472-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) { }

  /**
   * Actualiza el estado de los botones en Firebase para controlar los motores del ESP32
   * @param motorIndexes - Índices de los motores a activar (1-6)
   * @returns Observable con la respuesta de Firebase
   */
  activateMotors(motorIndexes: number[]): Observable<any> {
    // Objeto para almacenar el estado de los botones
    const botones: Record<string, boolean> = {
      boton1: false,
      boton2: false,
      boton3: false,
      boton4: false,
      boton5: false,
      boton6: false
    };
    
    // Activa los botones correspondientes a los motores seleccionados
    motorIndexes.forEach(index => {
      if (index >= 1 && index <= 6) {
        botones[`boton${index}`] = true;
      }
    });

    // Envía los datos a Firebase
    return this.http.put(`${this.databaseUrl}/botones.json`, botones)
      .pipe(
        tap(response => console.log('Motores activados en Firebase:', response))
      );
  }

  /**
   * Resetea todos los botones a falso después de que el ESP32 haya procesado la solicitud
   */
  resetMotors(): Observable<any> {
    const botones = {
      boton1: false,
      boton2: false,
      boton3: false,
      boton4: false,
      boton5: false,
      boton6: false
    };
    
    return this.http.put(`${this.databaseUrl}/botones.json`, botones)
      .pipe(
        tap(response => console.log('Motores reseteados en Firebase:', response))
      );
  }

  /**
   * Obtiene el estado actual de los botones desde Firebase
   */
  getMotorStatus(): Observable<any> {
    return this.http.get(`${this.databaseUrl}/botones.json`)
      .pipe(
        tap(response => console.log('Estado actual de los motores:', response))
      );
  }

  activateProductRequests(products: { productId: number, quantity: number }[]): Observable<any> {
    // Enviar los productos solicitados a Firebase
    return this.http.put(`${this.databaseUrl}/solicitudes.json`, { 
      productos: products,
      estado: 'pendiente', // Para que el ESP32 sepa que hay una nueva solicitud
      timestamp: new Date().getTime()
    }).pipe(
      tap(response => console.log('Solicitud enviada a Firebase:', response))
    );
  }

  
}