import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
    list(): Observable<any[]> {
      return this.http.get<any[]>(`${environment.url_backend}/products`);
    }
  
    view(id: number): Observable<any> {
      return this.http.get<any>(`${environment.url_backend}/products/${id}`);
    }
  
    create(data: any): Observable<any> {
      return this.http.post<any>(`${environment.url_backend}/products`, data);
    }
  
    update(data: any): Observable<any> {
      return this.http.put<any>(`${environment.url_backend}/products/${data.id}`, data);
    }
  
    delete(id: number): Observable<any> {
      return this.http.delete<any>(`${environment.url_backend}/products/${id}`);
    }
}
