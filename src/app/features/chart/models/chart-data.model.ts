// chart-data.model.ts
import { ChartData, ChartType, ChartDataset } from 'chart.js';

// 定義每個圖表的數據結構
export interface CustomChartData
  extends ChartData<ChartType, number[], unknown> {
  title: string; // 圖表標題
  type: ChartType; // 圖表類型
  labels: string[]; // x 軸或 y 軸的標籤
  datasets: ChartDataset<ChartType, number[]>[]; // 圖表數據集
}
