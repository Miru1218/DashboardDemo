import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartData, ChartType } from 'chart.js';
import { catchError, map, Observable, of } from 'rxjs';
import { CustomChartData } from '../models/chart-data.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'assets/mock/charts';

  constructor(private http: HttpClient) {}

  private chartParams = [
    'bar-chart.json',
    'line-customer-chart.json',
    'line-visitor-chart.json',
    'doughnut-chart.json',
  ];

  getChartData(
    param: string,
  ): Observable<ChartData<ChartType, number[], unknown>> {
    const url = `${this.baseUrl}/${param}`;
    console.log(`Requesting chart data from URL: ${url}`);

    return this.http.get<CustomChartData>(url).pipe(
      map((data) => {
        console.log('Original data loaded from JSON:', data);
        return this.processChartData(data);
      }),
      catchError((error) => {
        console.error(`Failed to load data for ${param}`, error);
        return of({ type: 'bar', labels: [], datasets: [] });
      }),
    );
  }

  getAllChartData(): Observable<ChartData<ChartType, number[], unknown>>[] {
    return this.chartParams.map((param) => this.getChartData(param));
  }

  private processChartData(
    data: CustomChartData,
  ): ChartData<ChartType, number[], unknown> {
    if (!data?.datasets) {
      console.error('Data format is incorrect:', data);
      return { labels: [], datasets: [] };
    }
    return data;
  }
}
