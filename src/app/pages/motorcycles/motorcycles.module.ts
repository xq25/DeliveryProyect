import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MotorcyclesRoutingModule } from './motorcycles-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { TrackComponent } from './track/track.component'; // 👈 Importar
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'; // 👈 Importar


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent,
    TrackComponent // 👈 Declarar
  ],
  imports: [
    CommonModule,
    MotorcyclesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    GoogleMapsModule // 👈 Agregar
  ]
})
export class MotorcyclesModule { }