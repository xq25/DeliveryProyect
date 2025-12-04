import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { TimeSeriesGraphComponent } from './time-series-graph/time-series-graph.component';

const routes: Routes = [
  {
    path: 'pieChart',
    component: PieChartComponent
  },
  {
    path: 'barChart',
    component: BarChartComponent
  },
  {
    path: 'timeSeriesGraph',
    component: TimeSeriesGraphComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
