import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { SecurityService } from 'src/app/services/security.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: '' },             // Dashboard → pantalla
  { path: '/orders/list', title: 'Pedidos', icon: 'ni-basket text-blue', class: '' },           // Pedidos → carrito
  { path: '/menus/list', title: 'Menus', icon: 'ni-bullet-list-67 text-orange', class: '' },     // Menus → lista
  { path: '/shifts/list', title: 'Turnos Repartidores', icon: 'ni-calendar-grid-58 text-yellow', class: '' }, // Turnos → calendario
  { path: '/motorcycles/list', title: 'Motos', icon: 'ni-settings-gear-65 text-red', class: '' },       // Motos → bicicleta/moto
  { path: '/drivers/list', title: 'Conductores', icon: 'ni-single-02 text-green', class: '' }, // Conductores → persona
  { path: '/customers/list', title: 'Clientes', icon: 'ni-hat-3 text-info', class: '' },       // Clientes → usuario
  { path: '/restaurants/list', title: 'Restaurantes', icon: 'ni-shop text-red', class: '' },    // Restaurantes → tienda/restaurante
  { path: '/products/list', title: 'Productos', icon: 'ni-box-2 text-pink', class: '' },        // Productos → caja/producto
  { path: '/reports', title: 'Informes', icon: 'ni-chart-bar-32 text-default', class: '' },        // Informes → grafico
];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  user: User;
  subscription: Subscription;

  constructor(private router: Router, public securityService: SecurityService) { 
    this.subscription = this.securityService.getUser().subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
