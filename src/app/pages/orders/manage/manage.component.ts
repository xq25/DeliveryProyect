import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { OrdersService } from 'src/app/services/orders.service';
import { Order } from 'src/app/models/Order';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  /** 1 = view, 2 = create, 3 = update */
  mode: number;

  /** Modelo cargado desde backend */
  order: Order | undefined;

  /** Campos del formulario dinámico */
  fields: string[] = [
    'quantity',
    'total_price',
    'status',
    'motorcycle_id',
    'customer_id',
    'menu_id',
  ];

  /** Configuración completa del <app-dynamic-form> */
  formConfig: any;

  /** Validaciones de cada campo */
  rules: any = {};

  /** Campos deshabilitados */
  disableFields: string[] = [];

  /** Campos ocultos */
  hiddenFields: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Detectar modo según la URL
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    // Configuración inicial
    this.disableFields = ['id'];
    this.hiddenFields = ['id', 'created_at']; // created_at lo suele manejar backend

    this.setupRules();

    // Si existe un id → cargar datos
    const id = this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.loadOrder(id);
    } else {
      this.order = undefined;
      this.buildFormConfig(); // para modo create
    }
  }

  /** Reglas de validación */
  setupRules() {
    this.rules = {
      quantity: [Validators.required],
      total_price: [Validators.required],
      status: [Validators.required],
      motorcycle_id: [Validators.required],
      customer_id: [Validators.required],
      menu_id: [Validators.required],
    };

    // En modo crear, ocultar campos que no deberían aparecer
    if (this.mode === 2) {
      this.hiddenFields.push('status'); // opcional
      this.hiddenFields.push('total');  // opcional si backend calcula
    }
  }

  /** Cargar registro para view/update */
  loadOrder(id: number) {
    this.service.view(id).subscribe({
      next: (response) => {
        this.order = response;
        this.buildFormConfig();
      },
      error: (err) => {
        console.error('Error loading order:', err);
      }
    });
  }

  /** Construcción del formConfig para <app-dynamic-form> */
  buildFormConfig() {
    this.formConfig = {
      mode: this.mode,
      fields: this.fields,
      rules: this.rules,
      hiddenFields: this.hiddenFields,
      disableFields: this.disableFields,
      model: this.order || {}
    };
  }

  /** Recepción del submit emitido por el formulario dinámico */
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

  /** Crear registro */
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

  /** Actualizar registro */
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
