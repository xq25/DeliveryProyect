import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AddressesService } from 'src/app/services/addresses.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  /** Modo de formulario: 1 = view, 2 = create, 3 = update */
  mode: number;

  /** Modelos*/
  address: any;
  orders: any

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'street',
    'city',
    'state',
    'postal_code',
    'additional_info',
    'order_id'
  ];

  /** Configuración del formulario dinámico */
  formConfig: any;

  /** Validaciones */
  rules: any = {};

  /** Campos SELECT */
  selectFields: any = {};

  /** Campos deshabilitados */
  disableFields: string[] = [];

  /** Campos ocultos */
  hiddenFields: string[] = [];

  constructor(private activatedRoute: ActivatedRoute,private router: Router,private service: AddressesService, private orderService: OrdersService) {}

  ngOnInit(): void {

    // Detectar modo por URL
    const url = this.activatedRoute.snapshot.url.join('/');
    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    // Configuración inicial
    this.disableFields = ['id'];
    if (this.mode === 2) this.hiddenFields = ['id'];

    this.setupRules();
    this.getIds(() => {
      if (this.orders.length == 0) {
        Swal.fire('Atención', 'Debe crear una orden antes de gestionar direcciones', 'warning');
        this.router.navigate(['/orders/create']);
        return;
      }
      this.selectFields['order_id'] = this.orders;
      // Cargar registro si aplica
      const id = this.activatedRoute.snapshot.params['id'];

      if (id) {
        this.loadAddress(id);
      } else {
        this.address = undefined;
        this.buildFormConfig();
      }
    })
    
  }

  /** Reglas de validación */
  setupRules() {
    this.rules = {
      street: [Validators.required, Validators.maxLength(40)],
      city: [Validators.required, Validators.maxLength(30)],
      state: [Validators.required, Validators.maxLength(30)],
      postal_code: [Validators.required, Validators.maxLength(10)],
      additional_info: [Validators.maxLength(100)],
      order_id: [Validators.required]
    };
  }

  /** Cargar registro desde backend */
  loadAddress(id: number) {
    this.service.view(id).subscribe({
      next: (resp) => {
        this.address = resp;
        this.buildFormConfig();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cargar el registro', 'error');
      }
    });
  }
  getIds(callback: Function) {
    let pending = 1; // cuando llegue a 0 → callback()

    // ORDERS
    this.orderService.list().subscribe(orders => {
      this.orders = orders.map(c => {
        return { value: c.id, label: c.id };
      });
      if (--pending === 0) callback();
    });

  }

  /** Crear configuración para el DynamicForm */
  buildFormConfig() {
    this.formConfig = {
      mode: this.mode,
      fields: this.fields,
      rules: this.rules,
      hiddenFields: this.hiddenFields,
      disableFields: this.disableFields,
      selectFields: this.selectFields,
      model: this.address || {}
    };
  }

  /** Manejo del submit */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {

    if (event.action === 'back') {
      this.router.navigate(['/addresses/list']); // <-- cambiar ruta
      return;
    }

    if (event.action === 'create') {
      this.createAddress(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateAddress(event.data);
      return;
    }
  }

  /** Crear registro */
  createAddress(formValue: any) {
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['/addresses/list']); // <-- cambiar
      },
      error: () => Swal.fire('Error', 'No se pudo crear', 'error')
    });
  }

  /** Actualizar registro */
  updateAddress(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Cambios guardados', 'success');
        this.router.navigate(['/addresses/list']); // <-- cambiar
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
  }
}
