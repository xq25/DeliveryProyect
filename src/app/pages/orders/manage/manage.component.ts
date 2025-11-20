import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { OrdersService } from 'src/app/services/orders.service';
import { Order } from 'src/app/models/Order';
import { CustomersService } from 'src/app/services/customers.service';
import { MotorcyclesService } from 'src/app/services/motorcycles.service';
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
  motorcycles_id: number[] = [];
  customers_id: number[] = [];
  menus_id: number[] = [];

  /** Campos del formulario */
  fields: string[] = [
    'quantity',
    'total_price',
    'status',
    'motorcycle_id',
    'customer_id',
    'menu_id',
  ];

  /** Campos SELECT */
  selectFields: any = {};

  /** Config dynamic-form */
  formConfig: any;

  rules: any = {};
  disableFields: string[] = [];
  hiddenFields: string[] = ['id'];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: OrdersService,
    private router: Router,
    private customersService: CustomersService,
    private motorcyclesService: MotorcyclesService,
    // private menusService: MenusService,
  ) {}

  ngOnInit(): void {

    // Detectar modo
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    this.setupRules();

    // Cargar IDs para selects
    this.getIds(() => {
      // Luego de tener los IDs ya podemos construir los selectFields
      this.selectFields = {
        motorcycle_id: this.motorcycles_id,
        customer_id: this.customers_id,
        menu_id: this.menus_id,
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
      quantity: [Validators.required],
      total_price: [Validators.required],
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
      this.customers_id = customers.map(c => c.id);
      if (--pending === 0) callback();
    });
    // MOTORCYCLES
    this.motorcyclesService.list().subscribe(motorcycles => {
      this.motorcycles_id = motorcycles.map(m => m.id);
      if (--pending === 0) callback();
    });

    // MENUS
    // this.menusService.list().subscribe(menus => {
    //   this.menus_id = menus.map(m => m.id);
    //   if (--pending === 0) callback();
    // });

    // Si aún no tienes motos y menús, simulemos vacío:
    this.motorcycles_id = [];
    this.menus_id = [];
    if (--pending === 0) callback();
    if (--pending === 0) callback();
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
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Orden creada correctamente', 'success');
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
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Orden actualizada correctamente', 'success');
        this.router.navigate(['/orders/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar la orden', 'error');
      }
    });
  }
}
