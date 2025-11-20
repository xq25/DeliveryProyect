import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  /** 1 = view, 2 = create, 3 = update */
  mode: number;

  /** Modelo del registro (cargado desde backend si aplica) */
  product: any;

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'name',
    'description',
    'price',
    'category'
  ];

  selectFields: any = {};

  /** Configuración final para el DynamicForm */
  formConfig: any;

  /** Validaciones */
  rules: any = {};

  /** Campos deshabilitados */
  disableFields: string[] = [];

  /** Campos ocultos */
  hiddenFields: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: ProductsService
  ) {}

  ngOnInit(): void {

    // Detectar modo por URL
    const url = this.activatedRoute.snapshot.url.join('/');
    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    this.disableFields = ['id'];
    this.hiddenFields = ['id'];

    this.setupRules();

    // Si existe id → cargar
    const id = this.activatedRoute.snapshot.params['id'];

    if (id) {
      this.loadProduct(id);
    } else {
      this.product = undefined;
      this.buildFormConfig();
    }
  }

  /** Validaciones */
  setupRules() {
    this.rules = {
      name: [Validators.required, Validators.minLength(3)],
      description: [Validators.required],
      price: [Validators.required, Validators.min(0)],
      category: [Validators.required]
    };
  }

  /** Cargar información desde el servicio (modo view/update) */
  loadProduct(id: number) {
    
    this.service.view(id).subscribe({
      next: (response) => {
        this.product = response;
        this.buildFormConfig();
      },
      error: (err) => console.error(err)
    });


    this.buildFormConfig();
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
      model: this.product || {}
    };
  }

  /** Manejo del submit del DynamicForm */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {

    if (event.action === 'back') {
      this.router.navigate(['/products/list']);
      return;
    }

    if (event.action === 'create') {
      this.createRecord(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateRecord(event.data);
      return;
    }
  }

  /** Crear registro */
  createRecord(formValue: any) {
    
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['/products/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo crear', 'error')
    });
    
  }

  /** Actualizar registro */
  updateRecord(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Cambios guardados', 'success');
        this.router.navigate(['/products/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
    

  }

}
