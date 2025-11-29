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
    'caption',
    'taken_at',
    'issue_id',
    'image_url',
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
    this.disableFields = ['id','image_url'];
    if (this.mode === 2) {
      this.hiddenFields = ['id','image_url'];
      this.disableFields = ['taken_at'];
    }
    if(this.mode === 1){
      this.disableFields = [
        'id',
        'caption',
        'taken_at',
        'issue_id',
        'image_url',
        'file',
      ];
    }

    this.setupRules();
    this.getIds(() => {
      if (this.issues.length == 0) {
        Swal.fire('Atención', 'Debe crear una orden antes de gestionar direcciones', 'warning');
        this.router.navigate(['/issues/create']);
        return;
      }
      this.selectFields = {
        issue_id : this.issues
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
      issue_id: [Validators.required],
      file: this.mode === 2 ? [Validators.required] : []
    };
  }

  /** Cargar registro desde backend */
  loadPhoto(id: number) {
    // 1. Obtener todas las fotos (sí devuelven JSON)
    this.service.list().subscribe({
      next: (photos) => {
        const photo = photos.find(p => p.id == id);

        if (!photo) {
          Swal.fire('Error', 'Foto no encontrada', 'error');
          return;
        }

        this.photo = photo; // ← JSON válido desde list()
        this.buildFormConfig();

        // 2. Cargar la imagen real (opcional)
        this.loadImageBlob(id);
      },
      error: () => Swal.fire('Error', 'No se pudo cargar la foto', 'error')
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
      this.router.navigate(['/photos/list']);
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
    formValue.issue_id = Number(formValue.issue_id);
    formValue.taken_at = new Date().toISOString();

    const file = formValue.file;
    delete formValue.file;

    // Si NO hay archivo → Crear normal
    if (!file) {
      this.service.create(formValue).subscribe({
        next: () => {
          Swal.fire('Creado!', 'Foto registrada', 'success');
          this.router.navigate(['/photos/list']);
        },
        error: () => Swal.fire('Error', 'No se pudo crear la foto', 'error')
      });
      return;
    }

    // Si hay archivo → Crear con archivo
    this.service.uploadWithData(formValue, file).subscribe({
      next: () => {
        Swal.fire('Creado!', 'Foto registrada con imagen', 'success');
        this.router.navigate(['/photos/list']);
      },
      error: () => Swal.fire('Error', 'No se pudo crear la foto con archivo', 'error')
    });
  }

  /** Actualizar registro */
  updatePhoto(formValue: any) {
    formValue.issue_id = Number(formValue.issue_id);

    const file = formValue.file;
    delete formValue.file;

    // Caso 1: NO hay archivo → actualizar normal
    if (!file) {
      this.service.update(formValue).subscribe({
        next: () => {
          Swal.fire('Actualizado!', 'Foto actualizada correctamente', 'success');
          this.router.navigate(['/photos/list']);
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
      });
      return
    }

    // Caso 2: HAY archivo → subirlo primero
    this.service.uploadWithData(formValue, file).subscribe({
      next: (resp: any) => {

        // Si backend devuelve la nueva URL
        if (resp.image_url) {
          formValue.image_url = resp.image_url;
        }

        // Luego hacer update normal
        this.service.update(formValue).subscribe({
          next: () => {
            Swal.fire('Actualizado!', 'Foto actualizada con nueva imagen', 'success');
            this.router.navigate(['/photos/list']);
          },
          error: () => Swal.fire('Error', 'No se pudo actualizar la foto', 'error')
        });
      },
      error: () => Swal.fire('Error', 'No se pudo subir la nueva imagen', 'error')
    });
    return
  }

  loadImageBlob(id: number) {
    this.service.view(id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      this.photo!.image_url = url; // mostrar en UI
    });
  }


}
