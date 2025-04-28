import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  private apiUrl = 'http://localhost:3000/compras';
  private apiUrlEnpoint = 'http://localhost:3000/endpoint';
  private apiUrlDetalle = 'http://localhost:3000/detalle_compras';

  constructor(private http: HttpClient) {}

  createCompras(id_users: Number): Observable<any> {
    return this.http.post(this.apiUrl, {id_users});
  }

  createDetalleCompras(id_compra: Number, id_producto: Number,cantidad: Number): Observable<any>{
    return this.http.post(this.apiUrlDetalle,{id_compra,id_producto,cantidad})
  }

  enpoint(id_users:Number,productos_a_comprar:Number):  Observable<any>{
    return this.http.post(this.apiUrlEnpoint,{id_users,productos_a_comprar});
  }

}
