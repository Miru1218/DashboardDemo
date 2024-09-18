import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Chart, ChartData, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DataService } from '../services/data.service';
import { CustomChartData } from '../models/chart-data.model';
import { ChartColorConfig } from '../models/chart-color-config.model';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';


Chart.register(ChartDataLabels);

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, PanelModule, ButtonModule, ChartModule, CardModule, MenubarModule, InputTextModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  // chart 的定義，要帶入的資料
  chartInfo: {
    [title: string]: {
      type: ChartType;
      title: string;
      data: ChartData<ChartType, number[], unknown>;
      options: ChartOptions;
    };
  } = {};

  // 卡片資料(4個方形)
  summaryCards = [
    {
      icon: 'pi pi-chart-bar',
      value: '$1k',
      title: 'Total Sales',
      change: '+8% from yesterday',
      color: '#fce4ec',
    },
    {
      icon: 'pi pi-shopping-bag',
      value: '300',
      title: 'Total Order',
      change: '+5% from yesterday',
      color: '#fff8e1',
    },
    {
      icon: 'pi pi-pencil',
      value: '5',
      title: 'Product Sold',
      change: '+1.2% from yesterday',
      color: '#e8f5e9',
    },
    {
      icon: 'pi pi-users',
      value: '8',
      title: 'New Customers',
      change: '+0.5% from yesterday',
      color: '#f3e5f5',
    },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.initCharts();
  }

  initCharts(): void {
    // 抓資料
    const chartRequests = this.dataService.getAllChartData();

    chartRequests.forEach((request, index) => {
      request.subscribe(
        (chartData: ChartData<ChartType, number[], unknown>) => {
          const customChartData = chartData as CustomChartData; // chartData 轉為 CustomChartData model

          // 用標題當每個圖表的key， HTML 的 key 要一致
          const chartTitle = customChartData.title
            .toLowerCase()
            .replace(/\s+/g, '-'); // ex. Customer Satisfaction -> customer-satisfaction
          const chartType: ChartType = this.getChartType(customChartData.type); // 抓圖表類型(bar, line...)
          const options: ChartOptions = this.getChartOptions(
            chartType,
            chartTitle,
          ); // 配置
          const colors: ChartColorConfig[] = this.getCustomColors(
            chartType,
            chartTitle,
          );

          // 設顏色
          customChartData.datasets = customChartData.datasets.map(
            (dataset, datasetIndex) => ({
              ...dataset,
              ...colors[datasetIndex],
            }),
          );

          // 帶入相關資料
          this.chartInfo[chartTitle] = {
            title: customChartData.title,
            type: chartType,
            data: customChartData,
            options: options,
          };
          console.log('Chart info updated:', this.chartInfo);
        },
      );
    });
  }

  // 圖表類型符不符合
  private getChartType(type: string): ChartType {
    return (
      ['line', 'bar', 'doughnut'].includes(type) ? type : 'line'
    ) as ChartType;
  }

  // 設定配置
  private getChartOptions(
    type: string,
    chartId: string,
    customOptions: Partial<ChartOptions> = {},
  ): ChartOptions {
    // 基礎配置(全部)
    const baseOptions: ChartOptions = {
      responsive: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: true,
          align: 'center',
          position: 'bottom',
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

    let specificOptions = this.getSpecificOptions(
      type,
      chartId,
    ) as Partial<ChartOptions>;
    return { ...baseOptions, ...specificOptions, ...customOptions };
  }

  // 根據圖表類型客製
  private getSpecificOptions(type: string, chartId: string): ChartOptions {
    switch (type) {
      case 'bar':
        return {
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true, // 點
                pointStyle: 'circle', // 圓形
              },
            },
            datalabels: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true, // Y軸從0開始
              grid: {
                display: true, // Y 軸格線
              },
              ticks: {
                callback: (value) => {
                  if (typeof value === 'number') {
                    return value >= 1000 ? value / 1000 + 'K' : value; // 把 Y 軸標籤變為 K
                  }
                  return value;
                },
              },
            },
            x: {
              grid: {
                display: false, // X 軸格線
              },
              barPercentage: 0.4, // 柱狀寬度
              categoryPercentage: 0.5, // 類別中所有柱狀寬度
            },
          },
          indexAxis: 'x',
          elements: {
            bar: {
              borderRadius: 5, // 柱狀圓角
              borderSkipped: false,
            },
          },
        } as ChartOptions;

      case 'line':
        switch (chartId) {
          case 'customer-satisfaction':
            return {
              plugins: {
                legend: {
                  display: true,
                  align: 'center',
                  position: 'bottom',
                },
                datalabels: {
                  display: false,
                },
              },
              elements: {
                line: {
                  tension: 0.4, // 曲線平滑度
                  fill: true, // 背景
                  borderWidth: 2,
                },
                point: {
                  backgroundColor: '#fff', // 點的顏色
                  borderWidth: 2, // 點的邊框寬度
                },
              },
            } as ChartOptions;

          case 'visitor-insights':
            return {
              elements: {
                line: {
                  tension: 0.2,
                  fill: false,
                  borderWidth: 3,
                },
                point: {
                  backgroundColor: '#000',
                  borderWidth: 3,
                },
              },
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    usePointStyle: false,
                    boxWidth: 15, // 圖例的寬度
                    boxHeight: 15, // 圖例的高度
                    generateLabels: (chart) => {
                      const datasets = chart.data.datasets;
                      return datasets.map((dataset, i) => ({
                        text: dataset.label,
                        fillStyle: dataset.backgroundColor,
                        strokeStyle:
                          dataset.borderColor || dataset.backgroundColor,
                        hidden: !chart.isDatasetVisible(i),
                        lineWidth: 0, // 沒有邊框
                      }));
                    },
                  },
                },
                datalabels: {
                  display: false,
                },
              },
            } as ChartOptions;

          default:
            return {
              elements: {
                line: {
                  tension: 0.5,
                  fill: false,
                  borderWidth: 2,
                },
                point: {
                  backgroundColor: '#ccc',
                  borderWidth: 1,
                },
              },
            } as ChartOptions;
        }

      case 'doughnut':
        return {
          circumference: 360, // 完整圓形
          rotation: -90, // 旋轉角度
          cutout: '70%', // 中心空心的大小
          plugins: {
            tooltip: { enabled: true },
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
            datalabels: {
              display: false,
            },
          },
        } as ChartOptions;

      default:
        return {} as ChartOptions;
    }
  }

  // 顏色配置
  private getCustomColors(
    chartType: string,
    chartId: string,
  ): ChartColorConfig[] {
    if (chartType === 'line') {
      switch (chartId) {
        case 'customer-satisfaction':
          return [
            {
              backgroundColor: 'rgba(0, 123, 255, 0.2)',
              borderColor: '#0095ff',
              pointBackgroundColor: '#0095ff',
            },
            {
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              borderColor: '#00e098',
              pointBackgroundColor: '#00e098',
            },
          ];
        case 'visitor-insights':
          return [
            {
              backgroundColor: '#a700ff',
              borderColor: 'purple',
              pointBackgroundColor: 'purple',
            },
            {
              backgroundColor: '#ef4444',
              borderColor: 'red',
              pointBackgroundColor: 'red',
            },
            {
              backgroundColor: '#3cd856',
              borderColor: 'green',
              pointBackgroundColor: 'green',
            },
          ];
        default:
          return [
            {
              backgroundColor: 'rgba(0, 149, 255, 0.2)',
              borderColor: '#0095ff',
              pointBackgroundColor: '#0095ff',
            },
            {
              backgroundColor: 'rgba(0, 224, 150, 0.2)',
              borderColor: '#00e096',
              pointBackgroundColor: '#00e096',
            },
          ];
      }
    } else if (chartType === 'bar') {
      return [
        {
          backgroundColor: '#0095ff',
        },
        {
          backgroundColor: '#00e096',
        },
      ];
    } else if (chartType === 'doughnut') {
      return [
        {
          backgroundColor: ['#007bff', '#28a745', '#dc3545'],
          borderColor: ['#007bff', '#28a745', '#dc3545'],
          borderWidth: 2,
        },
      ];
    } else {
      return [{ backgroundColor: '#0095ff' }, { backgroundColor: '#00e096' }];
    }
  }

  // 取所有圖表的標題
  getChartTitles(): string[] {
    return Object.keys(this.chartInfo);
  }
}
