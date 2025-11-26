import { Injectable } from '@angular/core';
import { Photo } from '../models/Photo';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(private http: HttpClient) { }
    
  // Listar todos las Photos
  list(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${environment.url_backend}/Photos`);
  }

  // Ver unPhoto por ID
  view(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${environment.url_backend}/Photos/${id}`);
  }

  // Crear unPhoto
  create(newPhoto: Photo): Observable<Photo> {
    delete newPhoto.id; // igual que drivers
    return this.http.post<Photo>(`${environment.url_backend}/Photos`, newPhoto);
  }

  // Actualizar unPhoto existente
  update(thePhoto: Photo): Observable<Photo> {
    return this.http.put<Photo>(`${environment.url_backend}/Photos/${thePhoto.id}`, thePhoto);
  }

  // Eliminar unPhoto
  delete(id: number): Observable<Photo> {
    return this.http.delete<Photo>(`${environment.url_backend}/Photos/${id}`);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.url_backend}/photos/upload`, formData);
  }
}
