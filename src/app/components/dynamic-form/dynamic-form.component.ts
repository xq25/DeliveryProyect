import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  /** ESTE ES EL OBJETO COMPLETO QUE RECIBES DESDE MANAGE */
  @Input() config: any;
  //El formConfig completo con:
  // fields: string[]; // campos del formulario
  // mode: number; // 1=view,2=create,3=update
  // selectFields: any; // campos de selección con opciones dinámicas 
  

  @Output() submit = new EventEmitter<any>();

  form: FormGroup = new FormGroup({});
  previewUrls: any = {}; // vistas previas por campo


  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    if (!this.config) return;
    this.buildForm();
  }

  /** Construye el formulario dinámico */
  buildForm() {
    this.form = this.fb.group({});

    for (const field of this.config.fields) {

      // Si el campo está oculto → no crear control
      if (this.config.hiddenFields.includes(field)) continue;

      const validations = this.config.rules[field] || [];

      const initialValue = this.config.model ? this.config.model[field] : ''; // Si pasamos un modelo, usar sus valores para rellenar el formulario

      const control = this.fb.control( // creamos un control por cada campo
        initialValue,
        validations
      );

      // Deshabilitar si corresponde
      if (this.config.disableFields.includes(field)) {
        control.disable();
      }

      this.form.addControl(field, control); // agregamos el control al formulario y el campo al que corresponde en el formulario
    }
  }

  /** Cuando el usuario envía el formulario */
  onSubmit() {
    if (this.form.invalid) {
      console.log('Formulario inválido: ', this.form.errors);
      return;
    }
    const cleanedData = this.form.getRawValue();
    console.log('Formulario enviado con datos: ', cleanedData);

    if (this.config.mode === 2) {
      this.submit.emit({ action: 'create', data: cleanedData });
    }

    if (this.config.mode === 3) {
      this.submit.emit({ action: 'update', data: cleanedData });
    }

    if (this.config.mode === 1) {
      this.submit.emit({ action: 'back' });
    }
  }

  onFileSelected(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {

      // Crear URL temporal para previsualización
      const url = URL.createObjectURL(file);
      this.previewUrls[field] = this.sanitizer.bypassSecurityTrustUrl(url);

      // Emitir evento al manage
      this.submit.emit({ action: 'file', field, file });
    }
  }

  //Utilities
  detectInputType(field: string): string {
    if (field.includes('email')) return 'email';
    if (field.includes('phone') || field === 'year' || field === 'price') return 'number';
    return 'text';
  }

}
