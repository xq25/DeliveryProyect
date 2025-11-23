import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../services/security.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  
  constructor(private securityService: SecurityService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
    if(this.securityService.existSession()){ // Si hay una sesion existente nos permite ver las paginas, para ello devolvemos true
      return true;
    }else{ // SI no hay sesion iniciada debemos de mandarlo al login.
      this.router.navigate(['/login'])
      return false;
    }

  }
  
}
