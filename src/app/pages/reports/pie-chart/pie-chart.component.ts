import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  mode: string = 'pie';
  tableNames: string[] = ['Sales Report'];
  questions: string[] = ['What are the sales figures for each product?'];
  data: any[] = [];

  constructor(private service: ReportsService) { }

  ngOnInit(): void {
    this.service.getPieChartsData().subscribe((response: any) => {
      this.tableNames = response.map((item: any) => item.tableName);
      this.questions = response.map((item: any) => item.pregunta);
      this.data = response.map((item: any) => item.datos);
    });
  }

}
