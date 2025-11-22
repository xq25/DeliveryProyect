import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../models/Menu';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(private http: HttpClient) { }
 
   // Listar todos los menus
  list(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${environment.url_backend}/menus`);
  }

  // Ver un menu por ID
  view(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${environment.url_backend}/menus/${id}`);
  }

  // Crear un menu
  create(newMenu: Menu): Observable<Menu> {
    delete newMenu.id; // igual que drivers
    return this.http.post<Menu>(`${environment.url_backend}/menus`, newMenu);
  }

  // Actualizar un menu existente
  update(theMenu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${environment.url_backend}/menus/${theMenu.id}`, theMenu);
  }

  // Eliminar un menu
  delete(id: number): Observable<Menu> {
    return this.http.delete<Menu>(`${environment.url_backend}/menus/${id}`);
  }
}
