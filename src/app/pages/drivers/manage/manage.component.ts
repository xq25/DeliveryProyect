import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from 'src/app/models/Driver';
import { DriversService } from 'src/app/services/drivers.service';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 = view, 2 = create, 3 = update

  driver: Driver | undefined;

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'name',
    'license_number',
    'phone',
    'email',
    'status'
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
    private service: DriversService,
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
    this.hiddenFields = ['id'];

    this.setupRules();

    // Si hay id → cargar driver
    const id = this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.loadDriver(id);
    } else {
      this.driver = undefined;
      this.buildFormConfig(); // construir configuración vacía
    }
  }

  /** Reglas de validación */
  setupRules() {
    this.rules = {
      name: [Validators.required, Validators.minLength(3)],
      license_number: [Validators.required],
      phone: [Validators.required, Validators.minLength(7)],
      email: [Validators.required, Validators.email],
      status: [Validators.required]
    };

    // Ocultar status en modo crear
    if (this.mode === 2) {
      this.hiddenFields.push('status');
    }
  }

  loadDriver(id: number) {/* Cargar información para modo view/update */
    this.service.view(id).subscribe({
      next: (response) => {
        this.driver = response;
        this.buildFormConfig();
      },
      error: (error) => {
        console.error('Error loading driver', error);
      }
    });
  }

  /** Construye el objeto que enviará al DynamicForm */
  buildFormConfig() {
    this.formConfig = {
      mode: this.mode,
      fields: this.fields,
      rules: this.rules,
      hiddenFields: this.hiddenFields,
      disableFields: this.disableFields,
      model: this.driver || {}  // datos iniciales\
    };
  }

  /* Manejo del evento emitido por el formulario */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {
    if (!event) return;

    if (event.action === 'back') {
      this.router.navigate(['/drivers/list']);
      return;
    }

    if (event.action === 'create') {
      this.createDriver(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateDriver(event.data);
      return;
    }
  }

  /** Crear */
  createDriver(formValue: any) {
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['/drivers/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear el registro', 'error');
      }
    });
  }

  /** Actualizar */
  updateDriver(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Registro actualizado correctamente', 'success');
        this.router.navigate(['/drivers/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el registro', 'error');
      }
    });
  }

}
