import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentsRoutingModule } from './departaments-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    DepartamentsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
  ]
})
export class DepartamentsModule { }
