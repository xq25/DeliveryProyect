import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/Customer';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Motorcycle } from '../models/Motorcycle';

@Injectable({
  providedIn: 'root'
})
export class MotorcyclesService {
  
  constructor(private http: HttpClient) {}

  /** Obtener todas las motocicletas */
  list(): Observable<Motorcycle[]> {
    return this.http.get<Motorcycle[]>(`${environment.url_backend}/motorcycles`);
  }

  /** Obtener una motocicleta por ID */
  view(id: number): Observable<Motorcycle> {
    return this.http.get<Motorcycle>(`${environment.url_backend}/motorcycles/${id}`);
  }

  /** Crear una motocicleta */
  create(data: any): Observable<Motorcycle> {
    return this.http.post<Motorcycle>(`${environment.url_backend}/motorcycles`, data);
  }

  /** Actualizar una motocicleta */
  update(data: any): Observable<Motorcycle> {
    return this.http.put<Motorcycle>(`${environment.url_backend}/motorcycles/${data.id}`, data);
  }
  
  /** Eliminar una motocicleta */
  delete(id: number): Observable<Motorcycle> {
    return this.http.delete<Motorcycle>(`${environment.url_backend}/motorcycles/${id}`);
  }
}
