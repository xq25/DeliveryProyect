import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from '../models/Issue';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IssuesService {

  constructor(private http: HttpClient) { }
  // Listar todos los Issues
  list(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${environment.url_backend}/issues`);
  }

  // Ver un Issue por ID
  view(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${environment.url_backend}/issues/${id}`);
  }

  // Crear un Issue
  create(newIssue: Issue): Observable<Issue> {
    delete newIssue.id; // igual que drivers
    return this.http.post<Issue>(`${environment.url_backend}/issues`, newIssue);
  }

  // Actualizar un Issue existente
  update(theIssue: Issue): Observable<Issue> {
    return this.http.put<Issue>(`${environment.url_backend}/issues/${theIssue.id}`, theIssue);
  }

  // Eliminar un Issue
  delete(id: number): Observable<Issue> {
    return this.http.delete<Issue>(`${environment.url_backend}/issues/${id}`);
  }
}
