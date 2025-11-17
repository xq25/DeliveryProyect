import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  /** ESTE ES EL OBJETO COMPLETO QUE RECIBES DESDE MANAGE */
  @Input() config: any;

  @Output() submit = new EventEmitter<any>();

  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

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
  //Utilities
  detectInputType(field: string): string {
    if (field.includes('email')) return 'email';
    if (field.includes('phone')) return 'number';
    return 'text';
  }

}
