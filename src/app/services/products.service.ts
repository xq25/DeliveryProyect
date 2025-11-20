import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  /** Obtener todas las motocicletas */
    list(): Observable<any[]> {
      return this.http.get<any[]>(`${environment.url_backend}/products`);
    }
  
    /** Obtener una motocicleta por ID */
    view(id: number): Observable<any> {
      return this.http.get<any>(`${environment.url_backend}/products/${id}`);
    }
  
    /** Crear una motocicleta */
    create(data: any): Observable<any> {
      return this.http.post<any>(`${environment.url_backend}/products`, data);
    }
  
    /** Actualizar una motocicleta */
    update(data: any): Observable<any> {
      return this.http.put<any>(`${environment.url_backend}/products/${data.id}`, data);
    }
  
    /** Eliminar una motocicleta */
    delete(id: number): Observable<any> {
      return this.http.delete<any>(`${environment.url_backend}/products/${id}`);
    }
}
