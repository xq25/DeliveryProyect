import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Theater } from 'src/app/models/Theaters';
import { TheatersService } from 'src/app/services/theaters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  mode: number; // 1: view, 2: create, 3: update
  theater: Theater;
  theFormGroup: FormGroup; // Policía de formulario
  trySend: boolean;
  constructor(private activatedRoute: ActivatedRoute, //Inyeccion de dependecias
    private theatersService: TheatersService,
    private router: Router,
    private theFormBuilder: FormBuilder //Definir las reglas Parecido a Yup
  ) {
    this.trySend = false;
    this.theater = { id: 0 };
    this.configFormGroup()
  }

  ngOnInit(): void { // Se ejecuta al carga la pagina automaticamente.
    const currentUrl = this.activatedRoute.snapshot.url.join('/'); // Hacemos una captura de la url inicial.
    if (currentUrl.includes('view')) { // Si nuestra url contiene 'view','create','update' Aqui definimos el modo de uso .
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
    // Si en la ruta tenemos parametros o variables.
    if (this.activatedRoute.snapshot.params.id) {
      this.theater.id = this.activatedRoute.snapshot.params.id // todo esto esta definido dentro de el theaters router.(Debe coincidir en la ruta desde el route con el este parametro .id)
      // Tomamos ese id y lo definimos como el id del teatro.
      this.getTheater(this.theater.id)
    }

  }
  configFormGroup() { // Aqui definimos los valores por defecto de los campos y las restricciones que tiene cada uno.
    this.theFormGroup = this.theFormBuilder.group({
      // primer elemento del vector, valor por defecto, el segundo elemento del vector son las reglas
      id: [0,[]],
      capacity: [0/*Valor por defecto */, [Validators.required, Validators.min(1), Validators.max(100)]/* Restricciones */], // Validators es propio de Angular 
      location: ['', [Validators.required, Validators.minLength(2)]]
    })
  }


  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  getTheater(id: number) {
    this.theatersService.view(id).subscribe({ // Llamamos al service para que nos devuleva el theater.
      next: (response) => {
        this.theater = response; 

        this.theFormGroup.patchValue({ // Aqui rellenamos los campos del formulario.
          id: this.theater.id,
          capacity: this.theater.capacity,
          location: this.theater.location
        });
        
        console.log('Theater fetched successfully:', this.theater);
      },
      error: (error) => {
        console.error('Error fetching theater:', error);
      }
    });
  }
  back() {
    this.router.navigate(['/theaters/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
    this.theatersService.create(this.theFormGroup.value).subscribe({
      next: (theater) => {
        console.log('Theater created successfully:', theater);
        Swal.fire({
          title: 'Creado!',
          text: 'Registro creado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/theaters/list']);
      },
      error: (error) => {
        console.error('Error creating theater:', error);
      }
    });
  }
  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
      })
      return;
    }
    this.theatersService.update(this.theFormGroup.value).subscribe({
      next: (theater) => {
        console.log('Theater updated successfully:', theater);
        Swal.fire({
          title: 'Actualizado!',
          text: 'Registro actualizado correctamente.',
          icon: 'success',
        })
        this.router.navigate(['/theaters/list']);
      },
      error: (error) => {
        console.error('Error updating theater:', error);
      }
    });
  }

}
