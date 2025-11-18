import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
constructor(private http: HttpClient) { }

  // Listar todos los customers
  list(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${environment.url_backend}/customers`);
  }

  // Ver un customer por ID
  view(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${environment.url_backend}/customers/${id}`);
  }

  // Crear un customer
  create(newCustomer: Customer): Observable<Customer> {
    delete newCustomer.id; // igual que drivers
    return this.http.post<Customer>(`${environment.url_backend}/customers`, newCustomer);
  }

  // Actualizar un customer existente
  update(theCustomer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${environment.url_backend}/customers/${theCustomer.id}`, theCustomer);
  }

  // Eliminar un customer
  delete(id: number): Observable<Customer> {
    return this.http.delete<Customer>(`${environment.url_backend}/customers/${id}`);
  }
}
