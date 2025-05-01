import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly databaseUrl = 'https://longibox-96472-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient) { }

  /**
   * Envía una solicitud de productos a Firebase para ser procesada por el ESP32
   * @param products Array de productos con sus cantidades
   * @returns Observable con la respuesta de Firebase
   */
  createProductRequest(products: { productId: number, quantity: number }[]): Observable<any> {
    // Crear el objeto de solicitud
    const request = { 
      productos: products,
      estado: 'pendiente',
      timestamp: new Date().getTime()
    };

    // Enviar la solicitud a Firebase
    return this.http.put(`${this.databaseUrl}/solicitudes.json`, request).pipe(
      tap(response => console.log('Solicitud enviada a Firebase:', response)),
      catchError(this.handleError)
    );
  }

  /**
   * Consulta el estado de una solicitud en Firebase
   * @returns Observable con el estado actual de la solicitud
   */
  getRequestStatus(): Observable<any> {
    return this.http.get(`${this.databaseUrl}/solicitudes.json`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja errores de las solicitudes HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error de comunicación';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}, mensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}