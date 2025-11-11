import { Injectable } from '@angular/core';
import { Theater } from '../models/Theaters';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TheatersService {

  constructor(private http: HttpClient) /*Inyeccion de dependencias (factories)*/{ }
  list(): Observable<Theater[]> { // Observable -> es una promesa 
    return this.http.get<Theater[]>(`${environment.url_backend}/theaters`);
  }
  view(id: number): Observable<Theater> {
    return this.http.get<Theater>(`${environment.url_backend}/theaters/${id}`);
  }
  create(newTheater: Theater): Observable<Theater> {
    delete newTheater.id;
    return this.http.post<Theater>(`${environment.url_backend}/theaters`, newTheater);
  }
  update(theTheater: Theater): Observable<Theater> {
    return this.http.put<Theater>(`${environment.url_backend}/theaters/${theTheater.id}`, theTheater);
  }

  delete(id: number) {
    return this.http.delete<Theater>(`${environment.url_backend}/theaters/${id}`);
  }
}
