import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

// core components
import {
  chartOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  public datasets: any[] = [];
  public data: any[] = [];
  public salesChart: any;
  public ordersChart: any;

  public clicked: boolean = true;
  public clicked1: boolean = false;

  ngOnInit() {
    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];

    this.data = this.datasets[0];
  }

  ngAfterViewInit() {

    const chartOrders = document.getElementById('chart-orders') as HTMLCanvasElement;

    this.ordersChart = new Chart(chartOrders, {
      type: chartExample2.type,
      data: chartExample2.data,
      options: chartExample2.options
    });


    const chartSales = document.getElementById('chart-sales') as HTMLCanvasElement;

    this.salesChart = new Chart(chartSales, {
      type: chartExample1.type,
      data: chartExample1.data,
      options: chartExample1.options
    });

  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
