import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SelectComponent } from './select/select.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TimeSeriesGraphComponent } from './time-series-graph/time-series-graph.component';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    SelectComponent,
    PieChartComponent,
    BarChartComponent,
    TimeSeriesGraphComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ComponentsModule
  ]
})
export class ReportsModule { }
