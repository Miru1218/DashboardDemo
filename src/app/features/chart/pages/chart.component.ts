import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { DataService } from '../services/data.service';
import { ChartsConfigService } from '../services/charts-config.service';
import { CustomChartData } from '../models/chart-data.model';
import { ChartColorConfig } from '../models/chart-color-config.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, PanelModule, ButtonModule, ChartModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  validChartTypes: ChartType[] = [
    'bar',
    'line',
    'scatter',
    'bubble',
    'pie',
    'doughnut',
    'polarArea',
    'radar',
  ];

  chartInfo: {
    [key: string]: {
      type: ChartType;
      title: string;
      data: ChartData<ChartType, number[], unknown>;
      options: ChartOptions;
    };
  } = {};

  constructor(
    private dataService: DataService,
    private chartsConfigService: ChartsConfigService,
  ) {}

  ngOnInit(): void {
    this.initCharts();
  }

  initCharts(): void {
    const chartRequests = this.dataService.getAllChartData();

    chartRequests.forEach((request, index) => {
      request.subscribe(
        (chartData: ChartData<ChartType, number[], unknown>) => {
          const customChartData = chartData as CustomChartData; // 類型轉換為 `CustomChartData`

          // 添加空值檢查
          if (!customChartData.title) {
            console.error('Chart data is missing a title:', customChartData);
            return;
          }

          // 明確定義每個圖表的鍵名，確保與 HTML 模板中的鍵名一致
          const chartId = this.getChartIdByIndex(index); // 獲取固定鍵名
          const chartType: ChartType = this.getChartType(customChartData.type);

          const options: ChartOptions =
            this.chartsConfigService.getChartOptions(chartType); // 獲取配置
          const colors: ChartColorConfig[] =
            this.chartsConfigService.getCustomColors(chartType, chartId); // 獲取顏色

          // 設置顏色
          customChartData.datasets = customChartData.datasets.map(
            (dataset, datasetIndex) => ({
              ...dataset,
              backgroundColor: colors[datasetIndex]?.backgroundColor,
            }),
          );

          // 使用圖表名稱作為鍵存儲圖表信息
          this.chartInfo[chartId] = {
            title: customChartData.title,
            type: chartType,
            data: customChartData,
            options: options,
          };
          console.log('Chart info updated:', this.chartInfo); // 查看更新後的 chartInfo
        },
      );
    });
  }

  // 根據索引為每個圖表提供固定的鍵名
  private getChartIdByIndex(index: number): string {
    const chartIds = ['bar-chart', 'line-chart', 'pie-chart']; // 預定義的圖表ID列表
    return chartIds[index] || `chart-${index}`; // 返回對應ID，或使用默認格式
  }

  private getChartType(type: string): ChartType {
    if (this.validChartTypes.includes(type as ChartType)) {
      return type as ChartType;
    } else {
      console.warn(`無效的圖表類型：${type}，使用默認 'bar' 類型`);
      return 'bar';
    }
  }
}
