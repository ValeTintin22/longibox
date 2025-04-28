import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor() { }

  private datoSource = new BehaviorSubject<number>(0); 
  datoActual  = this.datoSource.asObservable();

  pasarDato(dato: number) {
    this.datoSource.next(dato);
  }
}
