import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { OrdersService } from 'src/app/services/orders.service';
import { Order } from 'src/app/models/Order';
import { CustomersService } from 'src/app/services/customers.service';
import { MotorcyclesService } from 'src/app/services/motorcycles.service';
import { MenusService } from 'src/app/services/menus.service';
import { NotificationService } from 'src/app/services/notifications.service';
// import { MotorcyclesService } from 'src/app/services/motorcycles.service';
// import { MenusService } from 'src/app/services/menus.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number;
  order: Order | undefined;

  /** IDs que irán al select */
  motorcycles: Object[] = [];
  customers: Object[] = [];
  menus: Object[] = [];

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'quantity',
    'total_price',
    'status',
    'motorcycle_id',
    'customer_id',
    'menu_id',
  ];

  /** Campos SELECT */
  selectFields: any = {

  };

  /** Config dynamic-form */
  formConfig: any;

  rules: any = {};
  disableFields: string[] = [];
  hiddenFields: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: OrdersService,
    private router: Router,
    private customersService: CustomersService,
    private motorcyclesService: MotorcyclesService,
    private menusService: MenusService,
    private notyService: NotificationService
  ) {}

  ngOnInit(): void {

    // Detectar modo
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;
    
    this.disableFields = ['id'];
    if (this.mode === 1){
      this.disableFields = ['quantity','total_price','status','motorcycle_id','customer_id','menu_id'];
    }

    this.setupRules();

    // Cargar IDs para selects
    this.getIds(() => {
      if (this.motorcycles.length === 0 || this.customers.length === 0 || this.menus.length === 0) {
        Swal.fire('Atención', 'Debe existir al menos una motocicleta, un cliente y un menú para crear una orden', 'warning');
        this.router.navigate(['/orders/list']);
        return;
      }
      // Luego de tener los IDs ya podemos construir los selectFields
      this.selectFields = {
        status: [ { value: 'pending', label: 'Pendiente' }, { value: 'accepted', label: 'Aceptado' }, { value: 'preparing', label: 'Preparando' }, { value: 'ready', label: 'Listo para recoger' }, { value: 'on_route', label: 'En camino' }, { value: 'delivered', label: 'Entregado' }, { value: 'cancelled', label: 'Cancelado' }, { value: 'failed', label: 'Entrega fallida' } ],
        motorcycle_id: this.motorcycles,
        customer_id: this.customers,
        menu_id: this.menus,
      };

      // Cargar registro (si aplica)
      const id = this.activatedRoute.snapshot.params['id'];

      if (id) {
        this.loadOrder(id);
      } else {
        this.order = undefined;
        this.buildFormConfig();
      }
    });
  }

  /** Validaciones */
  setupRules() {
    this.rules = {
      quantity: [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)],
      total_price: [Validators.required, Validators.min(0)],
      status: [Validators.required],
      motorcycle_id: [Validators.required],
      customer_id: [Validators.required],
      menu_id: [Validators.required],
    };
  }

  /** Cargar orden */
  loadOrder(id: number) {
    this.service.view(id).subscribe({
      next: (response) => {
        this.order = response;
        this.buildFormConfig();
      },
      error: (err) => console.error('Error loading order:', err)
    });
  }

  /** Obtener IDs de cada entidad */
  getIds(callback: Function) {
    let pending = 3; // cuando llegue a 0 → callback()

    // CUSTOMERS
    this.customersService.list().subscribe(customers => {
      this.customers = customers.map(c => {
        return { value: c.id, label: c.name };
      });
      if (--pending === 0) callback();
    });
    // MOTORCYCLES
    this.motorcyclesService.list().subscribe(motorcycles => {
      this.motorcycles = motorcycles.map(m => {
        return { value: m.id, label: m.license_plate };
      });
      if (--pending === 0) callback();
    });

    // MENUS
    this.menusService.list().subscribe(menus => {
      this.menus = menus.map(m => {
        return {value: m.id, label: m.id}
      });
      if (--pending === 0) callback();
    });

  }

  /** Armar configuración del DynamicForm */
  buildFormConfig() {
    this.formConfig = {
      mode: this.mode,
      fields: this.fields,
      rules: this.rules,
      hiddenFields: this.hiddenFields,
      disableFields: this.disableFields,
      selectFields: this.selectFields,
      model: this.order || {}
    };
  }

  /** Evento del dynamic form */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {
    if (!event) return;

    switch (event.action) {
      case 'back':
        this.router.navigate(['/orders/list']);
        break;

      case 'create':
        this.createOrder(event.data);
        break;

      case 'update':
        this.updateOrder(event.data);
        break;
    }
  }

  /** Crear */
  createOrder(formValue: any) {
    formValue.quantity = Math.floor(formValue.quantity)
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Orden creada correctamente', 'success');
        this.notyService.push('success', 'Nueva Orden Asiganda');
        this.router.navigate(['/orders/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear la orden', 'error');
      }
    });
  }

  /** Actualizar */
  updateOrder(formValue: any) {
    formValue.quantity = Math.floor(formValue.quantity)
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Orden actualizada correctamente', 'success');
        this.notyService.push('warning', 'Orden Modificada');
        this.router.navigate(['/orders/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar la orden', 'error');
      }
    });
  }
}
