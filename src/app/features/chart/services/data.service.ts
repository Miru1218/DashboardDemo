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

  private chartParams = ['bar-chart.json']; // 多個圖表文件

  getChartData(
    param: string,
  ): Observable<ChartData<ChartType, number[], unknown>> {
    const url = `${this.baseUrl}/${param}`;
    console.log(`Requesting chart data from URL: ${url}`); // 添加調試信息，查看請求的URL

    return this.http.get<CustomChartData>(url).pipe(
      map((data) => {
        console.log('Original data loaded from JSON:', data); // 查看原始數據
        return this.processChartData(data);
      }),
      catchError((error) => {
        console.error(`Failed to load data for ${param}`, error);
        // 返回空的 `ChartData` 結構，避免出錯
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
      // 返回空的 `ChartData` 結構，避免出錯
      return { labels: [], datasets: [] };
    }
    return data;
  }
}
