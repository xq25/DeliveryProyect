import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data: any[] = []; // Esta es la lista de objetos que vamos a recibir para mostrar en la tabla.
  @Input() headers: string[] = []; // Esta es la lista de encabezados de la tabla.
  @Input() actionButtons: {
    label: string;
    class: string;
    action: string;
  }[] = [];

  // Emitimos un evento cuando se clickea un botón
  @Output() actionClicked = new EventEmitter<{ action: string; row: any }>();

  handleAction(action: string, row: any) {
    this.actionClicked.emit({ action, row });
  }

  constructor() { /* Aquio podria inyectar servicios o utilidades que necesite el componente.*/}

  ngOnInit(): void {
  }

}
