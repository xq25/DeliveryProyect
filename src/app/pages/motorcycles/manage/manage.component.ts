import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { MotorcyclesService } from 'src/app/services/motorcycles.service';
import { Motorcycle } from 'src/app/models/Motorcycle';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  /** 1 = view, 2 = create, 3 = update */
  mode: number;

  /** Modelo cargado desde backend */
  motorcycle: Motorcycle | undefined;

  /** Campos del formulario dinámico */
  fields: string[] = [
    'id',
    'license_plate',
    'brand',
    'year',
    'status'
  ];

  /** Configuración completa del formulario dinámico */
  formConfig: any;

  /** Reglas de validación */
  rules: any = {};

  /** Campos deshabilitados */
  disableFields: string[] = [];

  /** Campos ocultos */
  hiddenFields: string[] = [];

  selectFields: any = {
    status: [{ value: 'available', label: 'Available' }, { value: 'unavailable', label: 'Unavailable' }, { value: 'maintenance', label: 'Maintenance' }]
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: MotorcyclesService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Detectar modo según la URL
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    // Ajustes iniciales
    this.disableFields = ['id'];
    if (this.mode === 2) {
      this.hiddenFields = ['id'];
    }
    if (this.mode === 1){
      this.disableFields = ['id','license_plate','brand','year','status'];
    }

    this.setupRules();

    // Si existe id → cargar motocicleta
    const id = this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.loadMotorcycle(id);
    } else {
      this.motorcycle = undefined;
      this.buildFormConfig(); // modo create
    }
  }

  /** Reglas de validación del formulario */
  setupRules() {
    this.rules = {
      license_plate: [Validators.required, Validators.maxLength(8)],
      brand: [Validators.required, Validators.maxLength(20)],
      year: [Validators.required, Validators.min(1900), Validators.max((new Date().getFullYear()))],
      status: [Validators.required],
    };

    if (this.mode === 2) {
      this.hiddenFields.push('id');
    }
  }

  /** Cargar registro desde backend para view/update */
  loadMotorcycle(id: number) {
    this.service.view(id).subscribe({
      next: (response) => {
        this.motorcycle = response;
        this.buildFormConfig();
      },
      error: (err) => {
        console.error('Error loading motorcycle:', err);
      }
    });
  }

  /** Construcción de la configuración utilizada por <app-dynamic-form> */
  buildFormConfig() {
    this.formConfig = {
      mode: this.mode,
      fields: this.fields,
      rules: this.rules,
      hiddenFields: this.hiddenFields,
      disableFields: this.disableFields,
      model: this.motorcycle || {},
      selectFields: this.selectFields
    };
  }

  /** Manejo del evento emitido por el formulario dinámico */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {
    if (!event) return;

    if (event.action === 'back') {
      this.router.navigate(['/motorcycles/list']);
      return;
    }

    if (event.action === 'create') {
      this.createMotorcycle(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateMotorcycle(event.data);
      return;
    }
  }

  /** Crear registro */
  createMotorcycle(formValue: any) {
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Motocicleta creada correctamente', 'success');
        this.router.navigate(['/motorcycles/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear la motocicleta', 'error');
      }
    });
  }

  /** Actualizar registro */
  updateMotorcycle(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Motocicleta actualizada correctamente', 'success');
        this.router.navigate(['/motorcycles/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar la motocicleta', 'error');
      }
    });
  }

}
