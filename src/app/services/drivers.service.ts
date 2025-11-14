import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { Driver } from 'src/app/models/Driver';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  constructor(private http: HttpClient) { }
  list(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${environment.url_backend}/drivers`);
  }
  view(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${environment.url_backend}/drivers/${id}`);
  }
  create(newDriver: Driver): Observable<Driver> {
    delete newDriver.id;
    return this.http.post<Driver>(`${environment.url_backend}/drivers`, newDriver);
  }
  update(theDriver: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${environment.url_backend}/drivers/${theDriver.id}`, theDriver);
  }
  delete(id: number) {
    return this.http.delete<Driver>(`${environment.url_backend}/drivers/${id}`);
  }
}
