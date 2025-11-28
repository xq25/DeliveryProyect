import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Photo } from 'src/app/models/Photo';
import { IssuesService } from 'src/app/services/issues.service';
import { PhotosService } from 'src/app/services/photos.service';
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
  photo: Photo | undefined;
  issues: any

  /** Campos del formulario */
  fields: string[] = [
    'id',
    'image_url',
    'caption',
    'taken_at',
    'issue_id',
    'file',
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

  fileFields: string[] = ['file'];

  constructor(private activatedRoute: ActivatedRoute, private service: PhotosService, private router: Router, private issueService: IssuesService) { }

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
      this.disableFields = ['image_url'];
    }

    this.setupRules();
    this.getIds(() => {
      if (this.issues.length == 0) {
        Swal.fire('Atención', 'Debe crear una orden antes de gestionar direcciones', 'warning');
        this.router.navigate(['/issues/create']);
        return;
      }
      
      // Cargar registro si aplica
      const id = this.activatedRoute.snapshot.params['id'];

      if (id) {
        this.loadPhoto(id);
      } else {
        this.photo = undefined;
        this.buildFormConfig();
      }
    })
  }

  /** Reglas de validación */
  setupRules() {
    this.rules = {
      caption: [Validators.required, Validators.maxLength(30), Validators.minLength(3)],
      taken_at: [Validators.required],
      issue_id: [Validators.required],
      file: [Validators.required]
    };
  }

  /** Cargar registro desde backend */
  loadPhoto(id: number) {
    this.service.view(id).subscribe({
      next: (resp) => {
        this.photo = resp;
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

    // issues
    this.issueService.list().subscribe(issues => {
      this.issues = issues.map(i => {
        return { value: i.id, label: i.id };
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
      fileFields: this.fileFields,
      model: this.photo || {}
    };
  }

  /** Manejo del submit */
  handleFormSubmit(event: any) {

    if (event.action === 'back') {
      this.router.navigate(['/Photos/list']);
      return;
    }

    if (event.action === 'create') {
      this.createPhoto(event.data);
      return;
    }

    if (event.action === 'update') {
      this.updatePhoto(event.data);
      return;
    }
  }

  /** Crear registro */
  createPhoto(formValue: any) {
    const file = formValue.file
    delete formValue.file; // 👈 evitar enviar file al backend  
    formValue.taken_at = new Date().toISOString();
    console.log(formValue)
    
    this.service.uploadFile(file).pipe(
      switchMap((resp: any) => {
        formValue.image_url = resp.path;  // ejemplo: "/uploads/img.jpg"
        console.log(formValue)
        return this.service.create(formValue);
      })
    )
    .subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Cambios guardados', 'success');
        this.router.navigate(['/Photos/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
  }

  /** Actualizar registro */
  updatePhoto(formValue: any) {
    const file = formValue.file;
    delete formValue.file; // ❗ evitar enviar file al backend
    formValue.taken_at = new Date().toISOString();

    if (!file) {
      // No hay archivo nuevo → solo actualizar
      this.service.update(formValue).subscribe({
        next: () => {
          Swal.fire('Actualizado!', 'Cambios guardados', 'success');
          this.router.navigate(['/Photos/list']);
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
      });
      return;
    }

    this.service.uploadFile(file).pipe(
      switchMap((resp: any) => {
        formValue.image_url = resp.path;  // ejemplo: "/uploads/img.jpg"
        return this.service.update(formValue);
      })
    )
    .subscribe({
      next: () => {
        Swal.fire('Actualizado!', 'Cambios guardados', 'success');
        this.router.navigate(['/Photos/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
    });
  }

  uploadFile(file: File){
    this.service.uploadFile(file).subscribe({
      next: (resp: any) => {
        const ruta = resp.path;  // ejemplo: "/uploads/imagen_x.jpg"
        return ruta
      },
      error: () => Swal.fire('Error', 'No se pudo subir el archivo', 'error')
    });
  }

}
