import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../models/Photo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  private apiUrl = `${environment.url_backend}/photos`;

  constructor(private http: HttpClient) {}

  /** Obtener todas las fotos */
  list(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }

  /** Obtener foto por ID */
  view(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.apiUrl}/${id}`);
  }

  /** Crear foto SIN archivo */
  create(photo: Photo): Observable<Photo> {
    return this.http.post<Photo>(this.apiUrl, photo);
  }

  /** Actualizar foto SIN archivo */
  update(photo: Photo): Observable<Photo> {
    return this.http.put<Photo>(`${this.apiUrl}/${photo.id}`, photo);
  }

  /** Eliminar foto */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear o actualizar foto CON archivo
   * Ruta backend: POST /photos/upload
   */
  uploadWithData(data: any, file: File): Observable<any> {
    const formData = new FormData();

    // Agregar datos normales del formulario
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    // Archivo
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
