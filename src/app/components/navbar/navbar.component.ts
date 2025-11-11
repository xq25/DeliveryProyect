import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  user: User
  subscription: Subscription // Este objeto nos va a permitir manejar la suscripcion a la variable famosa theUser
  constructor(location: Location,  private element: ElementRef, private router: Router, private securityService: SecurityService) { // Aca inyectamos la dependencia de SecurityService para suscribirnos a la variable famosa theUser
    this.location = location;
    this.subscription = this.securityService.getUser().subscribe(user => { // Nos suscribimos a la variable theUser para estar pendientes de los cambios en esta variable
      this.user = user; // Cada vez que theUser cambie, esta linea se ejecuta actualizando la variable user de este componente con el nuevo valor de theUser
    });
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

}
