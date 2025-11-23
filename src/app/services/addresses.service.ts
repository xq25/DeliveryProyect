import { Injectable } from '@angular/core';
import { Address } from '../models/Address';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

  constructor(private http: HttpClient) { }
  
  // Listar todos losAddresss
  list(): Observable<Address[]> {
    return this.http.get<Address[]>(`${environment.url_backend}/addresses`);
  }

  // Ver unAddress por ID
  view(id: number): Observable<Address> {
    return this.http.get<Address>(`${environment.url_backend}/addresses/${id}`);
  }

  // Crear unAddress
  create(newAddress: Address): Observable<Address> {
    delete newAddress.id; // igual que drivers
    return this.http.post<Address>(`${environment.url_backend}/addresses`, newAddress);
  }

  // Actualizar unAddress existente
  update(theAddress: Address): Observable<Address> {
    return this.http.put<Address>(`${environment.url_backend}/addresses/${theAddress.id}`, theAddress);
  }

  // Eliminar unAddress
  delete(id: number): Observable<Address> {
    return this.http.delete<Address>(`${environment.url_backend}/addresses/${id}`);
  }
}
