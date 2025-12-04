import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from './table/table.component';

import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { NotificationComponent } from './notification/notification.component';
import { SmartChartComponent } from './smart-chart/smart-chart.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ReactiveFormsModule,
    NgChartsModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    DynamicFormComponent,
    NotificationComponent,
    SmartChartComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent, 
    TableComponent,
    DynamicFormComponent,
    SmartChartComponent,
  ]
})
export class ComponentsModule { }
