import { ChartSettings } from "./chart-settings.interface";
import { ChartData } from "./api.interface";
import * as Highcharts from "highcharts";

export interface ChartItem {
  chartSettings: ChartSettings;
  chartData: ChartData;
  chartId: string;
  chartOptions: Highcharts.Options;
}
