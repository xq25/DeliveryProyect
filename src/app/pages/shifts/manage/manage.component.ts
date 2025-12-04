import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Shift } from 'src/app/models/Shift';
import { DriversService } from 'src/app/services/drivers.service';
import { MotorcyclesService } from 'src/app/services/motorcycles.service';
import { ShiftsService } from 'src/app/services/shifts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1 = view, 2 = create, 3 = update
  
    /** Modelos */
    shift: Shift | undefined;
    drivers: any[] = [];
    motorcycles: any[] = [];
  
    /** Campos del formulario */
    fields: string[] = [
      'id',
      'start_time',
      'end_time',
      'status',
      'driver_id',
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
  constructor(private activatedRoute: ActivatedRoute,private router: Router,private service: ShiftsService, private driverService: DriversService, private motorcycleService: MotorcyclesService) { }

  ngOnInit(): void {
    // Detectar modo por URL
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    // Configuración inicial
    this.disableFields = ['id', 'start_time','end_time' ];
    if (this.mode === 3){
      this.selectFields['status'] = [{ value: 'available', label: 'Disponible' }, { value: 'on_delivery', label: 'En entrega' }, { value: 'on_break', label: 'En descanso' }, { value: 'busy', label: 'Ocupado' }, { value: 'offline', label: 'Fuera de línea' },{ value: 'end_shift', label: 'Turno finalizado' }, { value: 'completed', label: 'Completado' }]
      
    }
    if (this.mode === 2) {
      this.selectFields['status'] = [{ value: 'available', label: 'Disponible' }, { value: 'on_delivery', label: 'En entrega' }, { value: 'busy', label: 'Ocupado' }, { value: 'offline', label: 'Fuera de línea' }]
      this.hiddenFields = ['id'];
      
    }
    if(this.mode === 1){
      this.disableFields = ['id','start_time','end_time','status','driver_id','motorcycle_id']
    }
    this.setupRules();

    this.getIds(() => {
      if (this.drivers.length === 0 || this.motorcycles.length === 0) {
        Swal.fire('Atención', 'Debe existir al menos un conductor y un vehiculo para crear un turno', 'warning');
        this.router.navigate(['/shifts/list']);
        return;
      }
      this.selectFields['driver_id'] = this.drivers;
      this.selectFields['motorcycle_id'] = this.motorcycles
      // Cargar registro (si aplica)
      const id = this.activatedRoute.snapshot.params['id'];

      if (id) {
        this.loadShift(id);
      } else {
        this.shift = undefined;
        this.buildFormConfig();
      }
    });
  }
  /** Reglas de validación */
  setupRules() {
    this.rules = {
      price: [Validators.required, Validators.min(0)],
      availability: [Validators.required],
      driver_id: [Validators.required],
      motorcycle_id: [Validators.required]
    };
  }
  /** Cargar registro desde backend */
  loadShift(id: number) {

    this.service.view(id).subscribe({
      next: (response) => {
        this.shift = response;
        this.buildFormConfig();
      },
      error: (error) => {
        console.error('Error loading record', error);
      }
    });
  }
  getIds(callback: Function) {
    let pending = 2; // cuando llegue a 0 → callback()

    // DRIVERS
    this.driverService.list().subscribe(drivers => {
      this.drivers = drivers.map(c => {
        return { value: c.id, label: c.name };
      });
      if (--pending === 0) callback();
    });
    
    // MOTORCYCLES
    this.motorcycleService.list().subscribe(motorcycles => {
      this.motorcycles = motorcycles.map(m => {
        return { value: m.id, label: m.license_plate };
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
      model: this.shift || {}
    };
  }

  /** Manejo del submit del DynamicForm */
  handleFormSubmit(event: { action: 'back' | 'create' | 'update', data?: any }) {

    if (event.action === 'back') {
      this.router.navigate(['/shifts/list']);
      return;
    }

    if (event.action === 'create') {
      this.createShift(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updateShift(event.data);
      return;
    }
  }

  /** Crear registro */
  createShift(formValue: any) {
    this.service.create(formValue).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Registro creado correctamente', 'success');
        this.router.navigate(['/shifts/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear el registro', 'error');
      }
    });
    
  }

  /** Actualizar registro */
  updateShift(formValue: any) {
    if(formValue.status === 'end_shift'){
      formValue.end_time = new Date().toISOString();
    }
    this.service.update(formValue).subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Registro actualizado correctamente', 'success');
        this.router.navigate(['/shifts/list']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo actualizar el registro', 'error');
      }
    });
  }

}
