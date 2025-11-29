import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Departament } from 'src/app/models/Departament';
import { DepartamentsService } from 'src/app/services/departaments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1 = view, 2 = create, 3 = update

  departament: Departament | undefined;

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'name'
  ];

  /** Configuración del formulario dinámico */
  formConfig: any;

  /** Reglas del formulario */
  rules: any = {};

  /** Campos deshabilitados */
  disableFields: string[] = [];

  /** Campos ocultos */
  hiddenFields: string[] = [];
  constructor(private activatedRoute: ActivatedRoute, private service: DepartamentsService, private router: Router) { }

  ngOnInit(): void {
    // Detectar modo según la URL
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    // Configuración inicial de campos
    this.disableFields = ['id'];
    
    if (this.mode === 2) {
      this.hiddenFields = ['id'];
    }
    if (this.mode === 1){
      this.disableFields = ['id','name'];
    }

    this.setupRules();

    // Si hay id → cargar driver
    const id = this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.loadDepartament(id);
    } else {
      this.departament = undefined;
      this.buildFormConfig(); // construir configuración vacía
    }
  }

  /** Reglas de validación */
  setupRules() {
    this.rules = {
      name: [Validators.required, Validators.minLength(3)],
    };
  }

  loadDepartament(id: number) {/* Cargar información para modo view/update */
    this.service.view(id).subscribe({
      next: (response) => {
        this.departament = response;
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
      model: this.departament || {}  // datos iniciales\
    };
  }

  /* Manejo del evento emitido por el formulario */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {
    if (!event) return;

    if (event.action === 'back') {
      this.router.navigate(['/departaments/list']);
      return;
    }

    if (event.action === 'create') {
      this.createDepartament(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateDepartament(event.data);
      return;
    }
  }

  /** Crear */
  createDepartament(formValue: any) {
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['/departaments/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear el registro', 'error');
      }
    });
  }

  /** Actualizar */
  updateDepartament(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Registro actualizado correctamente', 'success');
        this.router.navigate(['/departaments/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el registro', 'error');
      }
    });
  }

}
