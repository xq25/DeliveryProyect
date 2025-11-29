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
    
    if (this.mode === 2) {
      this.hiddenFields = ['id'];
    }
    if (this.mode === 1){
      this.disableFields = ['id','name','description','price','category' ];
    }

    this.setupRules();
    this.selectFields = {
      category: [
        { value: 'food', label: 'Comida' },{ value: 'hot_drinks', label: 'Bebidas calientes' },{ value: 'cold_drinks', label: 'Bebidas frías' },{ value: 'desserts', label: 'Repostería / Postres' },
        { value: 'fast_food', label: 'Comida rápida' },{ value: 'grill', label: 'Parrilla' },{ value: 'salads', label: 'Ensaladas' },{ value: 'soups', label: 'Sopas' },
        { value: 'pastas', label: 'Pastas' },{ value: 'seafood', label: 'Mariscos' },{ value: 'vegetarian', label: 'Vegetariano' },{ value: 'vegan', label: 'Vegano' },
        { value: 'breakfast', label: 'Desayunos' },{ value: 'specials', label: 'Especiales del día' },{ value: 'bakery', label: 'Panadería' },{ value: 'cocktails', label: 'Cocteles' },
        { value: 'alcoholic_drinks', label: 'Bebidas alcohólicas' },{ value: 'snacks', label: 'Snacks' },{ value: 'sauces', label: 'Salsas / Adiciones' },{ value: 'kids_menu', label: 'Menú infantil' }
      ]
    };

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
      this.createProduct(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateProduct(event.data);
      return;
    }
  }

  /** Crear registro */
  createProduct(formValue: any) {
    
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['/products/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo crear', 'error')
    });
    
  }

  /** Actualizar registro */
  updateProduct(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Cambios guardados', 'success');
        this.router.navigate(['/products/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
    

  }

}
