import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  showBarCharts() {
    this.router.navigate(['/reports/barChart']);
  }
  showPieCharts() {
    this.router.navigate(['/reports/pieChart']);
  }
  showTimeSeriesCharts() {
    this.router.navigate(['/reports/timeSeriesGraph']);
  }

}
