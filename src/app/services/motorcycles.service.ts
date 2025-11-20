import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../models/Customer';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotorcyclesService {
  
  constructor(private http: HttpClient) {}

  /** Obtener todas las motocicletas */
  list(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.url_backend}/motorcycles`);
  }

  /** Obtener una motocicleta por ID */
  view(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_backend}/motorcycles/${id}`);
  }

  /** Crear una motocicleta */
  create(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_backend}/motorcycles`, data);
  }

  /** Actualizar una motocicleta */
  update(data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_backend}/motorcycles/${data.id}`, data);
  }

  /** Eliminar una motocicleta */
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_backend}/motorcycles/${id}`);
  }
}
