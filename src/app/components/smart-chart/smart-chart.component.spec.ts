import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartChartComponent } from './smart-chart.component';

describe('SmartChartComponent', () => {
  let component: SmartChartComponent;
  let fixture: ComponentFixture<SmartChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
