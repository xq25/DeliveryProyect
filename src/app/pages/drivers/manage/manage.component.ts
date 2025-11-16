import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from 'src/app/models/Driver';
import { DriversService } from 'src/app/services/drivers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1;                         // 1=view, 2=create, 3=update
  driver: Driver = new Driver();            // Instancia base del formulario

  rules: any = {};                          // Reglas del formulario
  disableFields: string[] = [];             // Campos deshabilitados
  hiddenFields: string[] = [];              // Campos ocultos

  loading: boolean = true;

  constructor(private activatedRoute: ActivatedRoute,private service: DriversService,private router: Router) {}

  ngOnInit(): void {

    // Detectar modo con base en la URL
    const url = this.activatedRoute.snapshot.url.join('/');

    if (url.includes('view')) this.mode = 1;
    else if (url.includes('create')) this.mode = 2;
    else if (url.includes('update')) this.mode = 3;

    
    // Configuramos los campos ocultos y deshabilitados
    this.disableFields = ['id'];
    this.hiddenFields = ['id'] ;
    // Configurar reglas del formulario
    this.setupRules();


    // Verificar si hay param id → view/update
    if (this.activatedRoute.snapshot.params.id) {
      const id = this.activatedRoute.snapshot.params.id;
      this.loadDriver(id);
    } else {
      this.loading = false;
    }
  }

  setupRules() {
    this.rules = {
      name: { validators: ['required', { minlength: 3 }] },
      license_number: { validators: ['required'] },
      phone: { validators: ['required', { minlength: 7 }] },
      email: { validators: ['required', 'email'] },
      status: { validators: ['required'] }
    };

    // Ejemplo: en create ocultas el status
    if (this.mode === 2) this.hiddenFields.push('status');
  }

  loadDriver(id: number) {
    this.service.view(id).subscribe({
      next: (response) => {
        this.driver = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading driver', error);
        this.loading = false;
      }
    });
  }

  // ============================================================
  // FUNCIÓNES QUE RECIBE EL FORMULARIO CUANDO SE ENVÍA
  // ============================================================

  handleSubmit = (formValue: any) => {

    if (this.mode === 1) {
      this.router.navigate(['/drivers/list']);
      return;
    }

    if (this.mode === 2) {
      this.createDriver(formValue);
    }

    if (this.mode === 3) {
      this.updateDriver(formValue);
    }
  };

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
