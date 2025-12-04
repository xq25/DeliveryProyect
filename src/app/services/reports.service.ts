import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface ReportResponse {
    tableName: string;
    pregunta: string;
    datos: { [key: string]: number };
  }

@Injectable({
  providedIn: 'root'
})

export class ReportsService {
  

  private baseUrl = `${environment.url_postman}/reports`; // tu endpoint real

  constructor(private http: HttpClient) {}

  // 🔹 BARRAS
  getBarChartsData(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(`${this.baseUrl}/barCharts`);
  }

  // 🔹 PIE
  getPieChartsData(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(`${this.baseUrl}/pieCharts`);
  }

  // 🔹 SERIES TEMPORALES
  getTimeSeriesGraphData(): Observable<ReportResponse[]> {
    return this.http.get<ReportResponse[]>(`${this.baseUrl}/time-series`);
  }

}
