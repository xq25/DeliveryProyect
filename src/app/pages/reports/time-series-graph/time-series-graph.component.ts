import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-time-series-graph',
  templateUrl: './time-series-graph.component.html',
  styleUrls: ['./time-series-graph.component.scss']
})
export class TimeSeriesGraphComponent implements OnInit {
  mode: string = 'line';
  tableNames: string[] = ['Time Series Report'];
  questions: string[] = ['What are the trends over time?'];
  data: any[] = [];

  constructor(private service: ReportsService) { }

  ngOnInit(): void {
    this.service.getTimeSeriesGraphData().subscribe((response: any) => {
      this.tableNames = response.map((item: any) => item.tableName);
      this.questions = response.map((item: any) => item.pregunta);
      this.data = response.map((item: any) => item.datos);
    });
  }

}
