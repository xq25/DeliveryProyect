import { Injectable } from '@angular/core';
import { Departament } from '../models/Departament';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartamentsService {
  constructor(private http: HttpClient) { }
  list(): Observable<Departament[]> {
    return this.http.get<Departament[]>(`${environment.url_backend}/departaments`);
  }
  view(id: number): Observable<Departament> {
    return this.http.get<Departament>(`${environment.url_backend}/departaments/${id}`);
  }
  create(newDepartament: Departament): Observable<Departament> {
    delete newDepartament.id;
    return this.http.post<Departament>(`${environment.url_backend}/departaments`, newDepartament);
  }
  update(theDepartament: Departament): Observable<Departament> {
    return this.http.put<Departament>(`${environment.url_backend}/departaments/${theDepartament.id}`, theDepartament);
  }
  delete(id: number) {
    return this.http.delete<Departament>(`${environment.url_backend}/departaments/${id}`);
  }
}
