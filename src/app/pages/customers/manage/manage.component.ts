import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Customer } from 'src/app/models/Customer';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 = view, 2 = create, 3 = update

  customer: Customer | undefined;

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'name',
    'email',
    'phone',
  ];

  /** Configuración del formulario dinámico */
  formConfig: any;

  /** Reglas del formulario */
  rules: any = {};

  /** Campos deshabilitados */
  disableFields: string[] = [];

  /** Campos ocultos */
  hiddenFields: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: CustomersService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Detectar modo según la URL
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    // Configuración inicial de campos
    this.disableFields = ['id'];
    
    // Ocultar status en modo create
    if (this.mode === 2) {
      this.hiddenFields = ['id'];
    }
    if (this.mode === 1){
      this.disableFields = ['id','name','email','phone'];
    }

    // Reglas iniciales
    this.setupRules();

    // Obtener ID si existe
    const id = this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.loadCustomer(id);
    } else {
      this.customer = undefined;
      this.buildFormConfig(); // Construir configuración vacía
    }
  }

  /** Reglas del formulario */
  setupRules() {
    this.rules = {
      name: [Validators.required, Validators.minLength(3)],
      email: [Validators.required, Validators.email],
      phone: [Validators.required, Validators.minLength(7)],
    };

    
  }

  /** Cargar información del customer */
  loadCustomer(id: number) {
    this.service.view(id).subscribe({
      next: (data) => {
        this.customer = data;
        this.buildFormConfig();
      },
      error: (err) => {
        console.error('Error loading customer', err);
      }
    });
  }

  /** Construcción del config para el DynamicForm */
  buildFormConfig() {
    this.formConfig = {
      mode: this.mode,
      fields: this.fields,
      rules: this.rules,
      hiddenFields: this.hiddenFields,
      disableFields: this.disableFields,
      model: this.customer || {}
    };
  }

  /** Manejo del submit emitido por el DynamicForm */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {
    if (!event) return;

    if (event.action === 'back') {
      this.router.navigate(['/customers/list']);
      return;
    }

    if (event.action === 'create') {
      this.createCustomer(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateCustomer(event.data);
      return;
    }
  }

  /** Crear customer */
  createCustomer(formValue: any) {
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Cliente creado correctamente', 'success');
        this.router.navigate(['/customers/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear el cliente', 'error');
      }
    });
  }

  /** Actualizar customer */
  updateCustomer(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Cliente actualizado correctamente', 'success');
        this.router.navigate(['/customers/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el cliente', 'error');
      }
    });
  }

}
