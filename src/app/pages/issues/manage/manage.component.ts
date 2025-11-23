import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Issue } from 'src/app/models/Issue';
import { IssuesService } from 'src/app/services/issues.service';
import { MotorcyclesService } from 'src/app/services/motorcycles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  /** Modo de formulario: 1 = view, 2 = create, 3 = update */
  mode: number;

  /** Modelos*/
  issue: Issue | undefined;
  motorcycles: any

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'description',
    'issue_type',
    'date_reported',
    'status',
    'motorcycle_id'
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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: IssuesService, private motorcyclesService: MotorcyclesService) { }

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
      if (this.motorcycles.length == 0) {
        Swal.fire('Atención', 'Debe crear una motocicleta antes de gestionar inconvenientes', 'warning');
        this.router.navigate(['/motorcycles/create']);
        return;
      }
      this.selectFields = {
        status: [{ value: 'available', label: 'Available' }, { value: 'unavailable', label: 'Unavailable' }, { value: 'maintenance', label: 'Maintenance' }],
        issue_type: [{ value: 'mechanical', label: 'Mechanical' }, { value: 'electrical', label: 'Electrical' }, { value: 'inspection', label: 'Inspection' }, { value: 'accident', label: 'Accident' }, { value: 'other', label: 'Other' }],
        motorcycle_id: this.motorcycles
      }
      // Cargar registro si aplica
      const id = this.activatedRoute.snapshot.params['id'];

      if (id) {
        this.loadIssue(id);
      } else {
        this.issue = undefined;
        this.buildFormConfig();
      }
    })
  }

  /** Reglas de validación */
  setupRules() {
    this.rules = {
      description: [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      issue_type: [Validators.required],
      date_reported: [Validators.required],
      status: [Validators.required],
      additional_info: [Validators.maxLength(40)],
      motorcycle_id: [Validators.required]
    };
  }

  /** Cargar registro desde backend */
  loadIssue(id: number) {
    this.service.view(id).subscribe({
      next: (resp) => {
        this.issue = resp;
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
    this.motorcyclesService.list().subscribe(motorcycle => {
      this. motorcycles = motorcycle.map(c => {
        return { value: c.id, label: c.license_plate };
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
      model: this.issue || {}
    };
  }

  /** Manejo del submit */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {

    if (event.action === 'back') {
      this.router.navigate(['/issues/list']); // <-- cambiar ruta
      return;
    }

    if (event.action === 'create') {
      this.createIssue(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateIssue(event.data);
      return;
    }
  }

  /** Crear registro */
  createIssue(formValue: any) {
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['/issues/list']); // <-- cambiar
      },
      error: () => Swal.fire('Error', 'No se pudo crear', 'error')
    });
  }

  /** Actualizar registro */
  updateIssue(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Cambios guardados', 'success');
        this.router.navigate(['/issues/list']); // <-- cambiar
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
  }

}
