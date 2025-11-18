import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Order } from 'src/app/models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  /** Listar todos los pedidos */
  list(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.url_backend}/orders`);
  }

  /** Ver un pedido por ID */
  view(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.url_backend}/orders/${id}`);
  }

  /** Crear un nuevo pedido */
  create(order: Order): Observable<Order> {
    delete order.id;
    return this.http.post<Order>(`${environment.url_backend}/orders`, order);
  }

  /** Actualizar pedido existente */
  update(order: Order): Observable<Order> {
    return this.http.put<Order>(`${environment.url_backend}/orders/${order.id}`, order);
  }

  /** Eliminar pedido */
  delete(id: number): Observable<Order> {
    return this.http.delete<Order>(`${environment.url_backend}/orders/${id}`);
  }
}
