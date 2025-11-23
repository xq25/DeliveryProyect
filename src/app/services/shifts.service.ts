import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shift } from '../models/Shift';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShiftsService {

  constructor(private http: HttpClient) { }
  list(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${environment.url_backend}/shifts`);
  }
  view(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${environment.url_backend}/shifts/${id}`);
  }
  create(newShift: Shift): Observable<Shift> {
    delete newShift.id;
    return this.http.post<Shift>(`${environment.url_backend}/shifts`, newShift);
  }
  update(theShift: Shift): Observable<Shift> {
    return this.http.put<Shift>(`${environment.url_backend}/shifts/${theShift.id}`, theShift);
  }
  delete(id: number): Observable<Shift> {
    return this.http.delete<Shift>(`${environment.url_backend}/shifts/${id}`);
  }
}
