import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';


@Component({
  selector: 'app-smart-chart',
  templateUrl: './smart-chart.component.html',
  styleUrls: ['./smart-chart.component.scss']
})
export class SmartChartComponent implements OnChanges {

  @Input() mode: 'pie' | 'bar' | 'line' = 'bar';
  @Input() tableName!: string;
  @Input() question!: string;
  @Input() data!: { [key: string]: number };

  labels: string[] = [];
  values: number[] = [];

  chartData!: ChartData;
  chartType!: ChartType;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data) {
      this.labels = Object.keys(this.data);
      this.values = Object.values(this.data);

      this.updateChart();
    }
  }

  updateChart() {
    this.chartType = this.mode;

    // PIE CHART
    if (this.mode === 'pie') {
      this.chartData = {
        labels: this.labels,
        datasets: [
          {
            data: this.values
          }
        ]
      };
    }

    // BAR CHART
    if (this.mode === 'bar') {
      this.chartData = {
        labels: this.labels,
        datasets: [
          {
            label: this.tableName,
            data: this.values
          }
        ]
      };
    }

    // LINE CHART (SERIE TEMPORAL)
    if (this.mode === 'line') {
      this.chartData = {
        labels: this.labels,
        datasets: [
          {
            label: this.tableName,
            data: this.values,
            tension: 0.4,
            fill: true
          }
        ]
      };
    }
  }
}
