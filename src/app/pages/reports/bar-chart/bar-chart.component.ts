import { Component, OnInit } from '@angular/core';
import { table } from 'console';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  mode: string = 'bar';
  tableNames: string[] = ['Sales Report'];
  questions: string[] = ['What are the sales figures for each product?'];
  data: any[] = [];
  constructor(private service: ReportsService) { }

  ngOnInit(): void {
    this.service.getBarChartsData().subscribe((response: any) => {
      this.tableNames = response.map((item: any) => item.tableName);
      this.questions = response.map((item: any) => item.pregunta);
      this.data = response.map((item: any) => item.datos);
    });
  }

}
