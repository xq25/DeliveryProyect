import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private securityService: SecurityService, private router: Router) { } // Inyectamos el securitySercice para validar la sesion y necesitamos en router para asi poder redirigir a otro lado en caso tal de que no este login.
    
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let theUser = this.securityService.activeUserSession // Conssultamos la sesion
    const token = theUser["token"];
    // Si la solicitud es para la ruta de "login", no adjunta el token
    if (request.url.includes('/login') || request.url.includes('/token-validation')) { // qui esta la exclusion de rutas que necesitan el token.
      console.log("no se pone token")
      return next.handle(request); // Dejamos pasar la peticion original.
    } else {
      console.log("colocando token " + token)
      // Adjunta el token a la solicitud
      const authRequest = request.clone({ // Clonamos la request originaal y le agregamos en su header 'Authorization' el token.
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(authRequest).pipe( // Pasamos la request con el token.
        catchError((err: HttpErrorResponse) => {
        // Validamos las respuestas del backend sobre nuestra peticion.
          if (err.status === 401) { // Validamos las respuestas del backend
            Swal.fire({
              title: 'No está autorizado para esta operación',
              icon: 'error',
              timer: 5000
            });
            this.router.navigateByUrl('/dashboard');
          } else if (err.status === 400) {
            Swal.fire({
              title: 'Existe un error, contacte al administrador',
              icon: 'error',
              timer: 5000
            });
          }

          return new Observable<never>();

        }));
    }
    // Continúa con la solicitud modificada

  }

}


