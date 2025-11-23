import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root'
})

// Este guardian nos permite cargar ciertas paginas cuando  no hay usuario login, ejemplo la pagina de inicio de sesion
export class NoAuthenticationGuard implements CanActivate {
  constructor (private securityService: SecurityService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.securityService.existSession()){
      return true;
    }
    else{
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
  
}
