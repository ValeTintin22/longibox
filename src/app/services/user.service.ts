import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}

  //Se usa esto para obtener datos de todos los usurio disponibles que hay 

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  //

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByDni(dni: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/cedula/${dni}`);
  }

  //Comandos para crear, modificar, y eliminar un usuario

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
