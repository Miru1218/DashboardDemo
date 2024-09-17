import { Injectable } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { ChartColorConfig } from '../models/chart-color-config.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

@Injectable({
  providedIn: 'root',
})
export class ChartsConfigService {
  // 基礎配置
  private baseOptions: ChartOptions = {
    responsive: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: true,
        align: 'start',
        labels: {},
      },
      title: {
        display: true,
        text: '',
      },
    },
    layout: {
      padding: {
        top: -10,
      },
    },
  };

  constructor() {}

  // 取得特定類型圖表的配置
  getChartOptions(
    type: string,
    customOptions: Partial<ChartOptions> = {},
  ): ChartOptions {
    let specificOptions = this.getSpecificOptions(
      type,
    ) as Partial<ChartOptions>;
    return { ...this.baseOptions, ...specificOptions, ...customOptions };
  }

  // 根據圖表類型客製化配置
  private getSpecificOptions(type: string): ChartOptions {
    switch (type) {
      case 'bar':
        return {
          indexAxis: 'x',
        } as ChartOptions;

      case 'doughnut':
        return {
          circumference: 180,
          rotation: 270,
          cutout: '70%',
          plugins: {
            datalabels: {
              display: false,
            },
            tooltip: { enabled: false },
            legend: {
              display: false,
            },
          },
        } as ChartOptions;
      default:
        return {} as ChartOptions;
    }
  }

  // 返回顏色配置，基於圖表類型和ID
  getCustomColors(chartType: string, chartId: string): ChartColorConfig[] {
    if (chartType === 'bar') {
      switch (chartId) {
        case 'chart1':
          return [
            { backgroundColor: ['#007bff'] }, // Chart1 - Online Sales 顏色
            { backgroundColor: ['#28a745'] }, // Chart1 - Offline Sales 顏色
          ];
        case 'chart2':
          return [
            { backgroundColor: ['#ff5733'] }, // Chart2 - Online Sales 顏色
            { backgroundColor: ['#c70039'] }, // Chart2 - Offline Sales 顏色
          ];
        default:
          return [
            { backgroundColor: ['#0095ff'] }, // Default 顏色配置
            { backgroundColor: ['#00e096'] },
          ];
      }
    } else if (chartType === 'pie') {
      return [
        { backgroundColor: ['#007bff', '#28a745'] }, // Pie 圖的顏色
      ];
    } else {
      return [];
    }
  }
}
