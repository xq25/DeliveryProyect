import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  // BehaviorSubject es una variable reactiva que permite que otros componentes esten pendientes de los cambios de esta variable.
  theUser = new BehaviorSubject<User>(new User); // Aqui generamos una variable global reactiva para almacenar la informacion del usuario logueado.
                                                 //  Esto lo que dice es que esta variable va a ser visible para todos. Y va a ser de tipo User. 
  constructor(private http: HttpClient) { //Inyeccion de dependencias (HttpClient)
    this.verifyActualSession()
  }

  /**
  * Realiza la petición al backend con el correo y la contraseña
  * para verificar si existe o no en la plataforma
  * @param infoUsuario JSON con la información de correo y contraseña
  * @returns Respuesta HTTP la cual indica si el usuario tiene permiso de acceso
  */
  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_backend}/login`, user); // LLamdo al backend pasando los datos del usuario. Si todo sale bien el backend nos devuelve el token
  }
  /*
  Guardar la información de usuario en el local storage
  */
  saveSession(dataSesion: any) {
    let data: User = {
      id: dataSesion["id"],
      name: dataSesion["name"],
      email: dataSesion["email"],
      password: "",
      //role:dataSesion["role"],
      token: dataSesion["token"]
    };
    localStorage.setItem('sesion', JSON.stringify(data)); // Guardamos la sesion en el local storage
    this.setUser(data); // Actualizamos la informacion del theUser con los datos del usuario logueado(theUser es la variable global reactiva)
  }
  /**
    * Permite actualizar la información del usuario
    * que acabó de validarse correctamente
    * @param user información del usuario logueado
  */
  setUser(user: User) {
    this.theUser.next(user); // .next es un publisher que actualiza el valor de la variable reactiva theUser paraa avisar que cambio dicha variable a los que stuvieran pendientes de esta variable
  }
  /**
  * Permite obtener la información del usuario
  * con datos tales como el identificador y el token
  * @returns
  */
  getUser() {
    return this.theUser.asObservable();
  }
  /**
    * Permite obtener la información de usuario
    * que tiene la función activa y servirá
    * para acceder a la información del token
*/
  public get activeUserSession(): User {
    return this.theUser.value;
  }


  /**
  * Permite cerrar la sesión del usuario
  * que estaba previamente logueado
  */
  logout() {
    localStorage.removeItem('sesion');
    this.setUser(new User());
  }
  /**
  * Permite verificar si actualmente en el local storage
  * existe información de un usuario previamente logueado
  */
  verifyActualSession() {
    let actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion));
    }
  }
  /**
  * Verifica si hay una sesion activa
  * @returns
  */
  existSession(): boolean {
    let sesionActual = this.getSessionData();
    return (sesionActual) ? true : false;
  }
  /**
  * Permite obtener los dato de la sesión activa en el
  * local storage
  * @returns
  */
  getSessionData() {
    let sesionActual = localStorage.getItem('sesion');
    return sesionActual;
  }
}
