import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MenusService } from 'src/app/services/menus.service';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { ProductsService } from 'src/app/services/products.service';
import { Menu } from 'src/app/models/Menu';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 = view, 2 = create, 3 = update

  /** Modelos */
  menu: Menu | undefined;
  restaurants: any[] = [];
  products: any[] = [];

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'price',
    'availability',
    'restaurant_id',
    'product_id'
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

  constructor(private activatedRoute: ActivatedRoute,private router: Router,private service: MenusService, private restaurantService: RestaurantsService, private productService: ProductsService) {}

  ngOnInit(): void {

    // Detectar modo por URL
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    // Configuración inicial
    this.disableFields = ['id'];
    if (this.mode === 2) {
      this.hiddenFields = ['id'];
    }

    this.setupRules();

    this.getIds(() => {
      if (this.restaurants.length === 0 || this.products.length === 0) {
        Swal.fire('Atención', 'Debe existir al menos un restaurante y un producto para crear un menú', 'warning');
        this.router.navigate(['/menus/list']);
        return;
      }
      this.selectFields = {
        availability: [{ value: true, label: 'Available' }, { value: false, label: 'Not Available' }],
        restaurant_id: this.restaurants,
        product_id: this.products,
      };
      // Cargar registro (si aplica)
      const id = this.activatedRoute.snapshot.params['id'];

      if (id) {
        this.loadMenu(id);
      } else {
        this.menu = undefined;
        this.buildFormConfig();
      }
    });
  }

  /** Reglas de validación */
  setupRules() {
    this.rules = {
      price: [Validators.required, Validators.min(0)],
      availability: [Validators.required],
      restaurant_id: [Validators.required],
      product_id: [Validators.required]
    };
  }

  /** Cargar registro desde backend */
  loadMenu(id: number) {

    this.service.view(id).subscribe({
      next: (response) => {
        this.menu = response;
        this.buildFormConfig();
      },
      error: (error) => {
        console.error('Error loading record', error);
      }
    });
  }

  getIds(callback: Function) {
    let pending = 2; // cuando llegue a 0 → callback()

    // CUSTOMERS
    this.restaurantService.list().subscribe(restaurants => {
      this.restaurants = restaurants.map(c => {
        return { value: c.id, label: c.name };
      });
      if (--pending === 0) callback();
    });
    
    // PRODUCTS
    this.productService.list().subscribe(products => {
      this.products = products.map(p => {
        return { value: p.id, label: p.name };
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
      model: this.menu || {}
    };
  }

  /** Manejo del submit del DynamicForm */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {

    if (event.action === 'back') {
      this.router.navigate(['/menus/list']);
      return;
    }

    if (event.action === 'create') {
      this.createMenu(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateMenu(event.data);
      return;
    }
  }

  /** Crear registro */
  createMenu(formValue: any) {
    
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['/menus/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear el registro', 'error');
      }
    });
    
  }

  /** Actualizar registro */
  updateMenu(formValue: any) {
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Registro actualizado correctamente', 'success');
        this.router.navigate(['/menus/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el registro', 'error');
      }
    });
  }
}
