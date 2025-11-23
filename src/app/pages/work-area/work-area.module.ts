import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkAreaRoutingModule } from './work-area-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';


@NgModule({
  declarations: [
    ListComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    WorkAreaRoutingModule
  ]
})
export class WorkAreaModule { }
