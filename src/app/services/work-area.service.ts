import { Injectable } from '@angular/core';
import { WorkArea } from '../models/WorkArea';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkAreaService {

  constructor(private http: HttpClient) { }
    
  // Listar todos los WorkArea
  list(): Observable<WorkArea[]> {
    return this.http.get<WorkArea[]>(`${environment.url_backend}/WorkAreas`);
  }

  // Ver unWorkArea por ID
  view(id: number): Observable<WorkArea> {
    return this.http.get<WorkArea>(`${environment.url_backend}/WorkAreas/${id}`);
  }

  // Crear unWorkArea
  create(newWorkArea: WorkArea): Observable<WorkArea> {
    delete newWorkArea.id; // igual que drivers
    return this.http.post<WorkArea>(`${environment.url_backend}/WorkAreas`, newWorkArea);
  }

  // Actualizar unWorkArea existente
  update(theWorkArea: WorkArea): Observable<WorkArea> {
    return this.http.put<WorkArea>(`${environment.url_backend}/WorkAreas/${theWorkArea.id}`, theWorkArea);
  }

  // Eliminar unWorkArea
  delete(id: number): Observable<WorkArea> {
    return this.http.delete<WorkArea>(`${environment.url_backend}/WorkAreas/${id}`);
  }
}
