import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

// core components
import {
  chartOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {
    
  }
  irAGraficas() {
    this.router.navigate(['/reports']);
  }

}
