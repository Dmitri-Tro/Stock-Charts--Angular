import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChartData } from "../../interfaces/api.interface";
import { ChartSettings } from "../../interfaces/chart-settings.interface";
import { LoggerService } from "../logger-service/logger.service";
import * as Highcharts from 'highcharts';
import { ChartItem } from "../../interfaces/chart.interface";
import { ApiService } from "../api-service/api.service";

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  private chartDataSubject: BehaviorSubject<ChartData | null> = new BehaviorSubject<ChartData | null>(null);
  private chartSettingsSubject: BehaviorSubject<ChartSettings> = new BehaviorSubject<ChartSettings>({
    ticker: '',
    title: '',
    type: 'line',
    color: 'blue',
  });
  private chartOptionsSubject: BehaviorSubject<Highcharts.Options> = new BehaviorSubject<Highcharts.Options>({});
  chartOptions: Highcharts.Options = {};
  chartList: ChartItem[] = [];
  constructor(
    private apiService: ApiService,
    private logger: LoggerService,
   ) {  }

  // Updating charts data
  setChartData(data: ChartData | null): void {
    this.chartDataSubject.next(data);
    this.logger.log('In ChartDataService chart data set: ', data);
  }

  // Updating the chart Settings
  setChartSettings(settings: ChartSettings): void {
    this.chartSettingsSubject.next(settings);
    this.logger.log('In ChartDataService chart settings set','!');
  }

  // Updating the chart options (for chart view)
  updateChartOptions(chartSettings: ChartSettings, chartId: string, chartData?: ChartData): void {
    const chartIndex: number = this.chartList.findIndex((chart: ChartItem):boolean => chart.chartId === chartId);
    this.chartList[chartIndex].chartSettings = chartSettings;
    if (chartData) {
      this.chartList[chartIndex].chartData = chartData;
    }
      let titleText: string = this.chartList[chartIndex].chartSettings.title || '';
      titleText = titleText.trim() === '' ? this.chartList[chartIndex].chartData.chart.result[0].meta.symbol : titleText;
      this.chartOptions = {
        title: {
          text: titleText,
        },
        xAxis: {
          categories: this.chartList[chartIndex].chartData.chart.result[0].timestamp.map(
            (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString()
          ),
        },
        yAxis: {
          title: {
            text: this.chartList[chartIndex].chartData.chart.result[0].meta.currency,
          },
        },
        series: [
          {
            name: 'Closing price',
            type: this.chartList[chartIndex].chartSettings.type,
            data: this.chartList[chartIndex].chartData.chart.result[0].comparisons[0].close,
            color: this.chartList[chartIndex].chartSettings.color,
          },
        ],
      };
      this.chartOptionsSubject.next(this.chartOptions);
      this.chartList[chartIndex].chartOptions = this.chartOptions;
      this.logger.log('In ChartDataService chart options updated: ', this.chartOptions);
  }

  getChartSettings(): Observable<ChartSettings> {
    this.logger.log('In ChartDataService chart settings got','!');
    return this.chartSettingsSubject.asObservable();
  }

  addChart(chartSettings: ChartSettings,chartId: string, chartData: ChartData): void {
    const chartOptions: Highcharts.Options = this.chartOptions;
    const chart: ChartItem = {
      chartSettings,
      chartData,
      chartId,
      chartOptions
    }
    this.chartList.push(chart);
    this.logger.log('Chart added to the chartlist in ChartDataService', chart)
  }

  deleteChart(chartId: string): void {
    const index: number = this.chartList.findIndex((chart: ChartItem): boolean => chart.chartId === chartId);
      this.chartList.splice(index, 1);
    this.logger.log('Chart deleted', '!')
  }

  get getChartList() {
    this.logger.log('Chart list got from ChartDataService', '!')
    return this.chartList
  }

  // Filter data by date
  filterChartData(chartData: ChartData, startDate: Date, endDate: Date): ChartData {
    // Filter timestamp and corresponding yAxis data in the range startDate - endDate
    const filteredTimestamps: number[] = [];
    const filteredYAxisData: number[] = [];
    const timestampData: number[] = chartData.chart.result[0].timestamp;
    const yAxisData: number[] = chartData.chart.result[0].comparisons[0].close;
    for (let i: number = 0; i < timestampData.length - 1; ++i) {
      const timestamp: number = timestampData[i];
      const date: Date = new Date(timestamp * 1000);

      if (date >= startDate && date <= endDate) {
        filteredTimestamps.push(timestamp);
        filteredYAxisData.push(yAxisData[i]);
      }
    }
    // Create a new chartData object with filtered data
    const filteredChartData: ChartData = { ...chartData };
    filteredChartData.chart.result[0].timestamp = filteredTimestamps;
    filteredChartData.chart.result[0].comparisons[0].close = filteredYAxisData;
    this.logger.log('In ChartDataService chartData filtered', filteredChartData);
    return filteredChartData;
  }
}
