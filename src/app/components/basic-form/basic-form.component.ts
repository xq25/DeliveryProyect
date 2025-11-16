import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent implements OnInit, OnChanges {

  @Input() info: any = {};     // Objeto base para obtener los keys
  @Input() mode: number = 1;   // 1 = view, 2 = create, 3 = update
  @Input() rules: Record<string, any[]> = {}; // Reglas por campo
  @Input() disableFields: string[] = [];       // campos deshabilitados
  @Input() hiddenFields: string[] = [];        // campos ocultos

  @Output() formSubmit = new EventEmitter<any>(); // Evento hacia padre

  form: FormGroup;  
  keys: string[] = [];          // Keys del formulario (basado en info)
  trySend = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.generateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia la info, regeneramos el formulario
    if (changes['info'] && !changes['info'].firstChange) {
      this.generateForm();
    }
  }

  /**
   * Genera dinámicamente el formulario basado en los keys de "info"
   */
  private generateForm(): void {
    if (!this.info || typeof this.info !== 'object') return;

    this.keys = Object.keys(this.info);

    const group: any = {};

    this.keys.forEach(key => {
      const value = this.info[key] ?? null;
      const validators = this.rules[key] || [];

      group[key] = [value, validators];
    });

    this.form = this.fb.group(group);

    // Deshabilitar campos si es necesario
    this.disableFields.forEach(field => {
      if (this.form.controls[field]) {
        this.form.controls[field].disable();
      }
    });
  }

  /**
   * Enviar form al componente padre
   */
  submitForm() {
    this.trySend = true;

    if (this.form.invalid) return;

    this.formSubmit.emit(this.form.getRawValue()); // incluye valores de campos disabled
  }

  /**
   * Saber si un campo debe estar oculto
   */
  isHidden(key: string): boolean {
    return this.hiddenFields.includes(key);
  }
  isNumberField(key: string) {
    return typeof this.info[key] === 'number';
  }


  /**
   * Acceso rápido a los controles en la template
   */
  get f() {
    return this.form.controls;
  }
}
