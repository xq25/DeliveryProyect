import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { Restaurant } from 'src/app/models/Restaurant';
// IMPORTA TU SERVICIO REAL AQUÍ
// import { XService } from 'src/app/services/x.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  /** 1 = view, 2 = create, 3 = update */
  mode: number;

  /** Modelo del registro (cargado desde backend si aplica) */
  restaurant: any

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'name',
    'address',
    'phone',
    'email'
  ];

  /** Campos tipo select */
  selectFields: any = {};

  /** Configuración final para el DynamicForm */
  formConfig: any;

  /** Validaciones */
  rules: any = {};

  /** Campos deshabilitados */
  disableFields: string[] = [];

  /** Campos ocultos */
  hiddenFields: string[] = [];

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: RestaurantsService){}

  ngOnInit(): void {

    // Detectar modo por URL
    const url = this.activatedRoute.snapshot.url.join('/');
    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    this.disableFields = ['id'];
    if (this.mode === 2) {
      this.hiddenFields = ['id'];
    }

    this.setupRules();

    // Si existe id → cargar
    const id = this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.loadRestaurant(id);
    } else {
      this.restaurant = undefined;
      this.buildFormConfig();
    }
  }

  /** Validaciones */
  setupRules() {
    this.rules = {
      name: [Validators.required, Validators.minLength(3)],
      address: [Validators.required, Validators.minLength(5)],
      phone: [Validators.required, Validators.minLength(7)],
      email: [Validators.required, Validators.email]
    };

  }

  /** Cargar información desde el servicio */
  loadRestaurant(id: number) {

    this.service.view(id).subscribe({
      next: (response) => {
        this.restaurant = response;
        this.buildFormConfig();
      },
      error: (err) => console.error(err)
    });
  }

  /** Construcción final del configurador del DynamicForm */
  buildFormConfig() {
    this.formConfig = {
      mode: this.mode,
      fields: this.fields,
      rules: this.rules,
      hiddenFields: this.hiddenFields,
      disableFields: this.disableFields,
      selectFields: this.selectFields,
      model: this.restaurant || {}
    };
  }

  /** Manejar el evento emitido por DynamicForm */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {

    if (event.action === 'back') {
      this.router.navigate(['../list']);
      return;
    }

    if (event.action === 'create') {
      this.createRestaurant(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateRestaurant(event.data);
      return;
    }
  }

  /** Crear registro */
  createRestaurant(formValue: any) {
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['../list']);
      },
      error: () => Swal.fire('Error', 'No se pudo crear', 'error')
    });
  }

  /** Actualizar registro */
  updateRestaurant(formValue: any) {

    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Cambios guardados', 'success');
        this.router.navigate(['../list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
    
  }

}
