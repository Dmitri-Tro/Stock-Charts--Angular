import {Injectable} from '@angular/core';
import {AsyncSubject, Observable} from 'rxjs';
import {ChartData} from "../../interfaces/api.interface";
import {ChartSettings} from "../../interfaces/chart-settings.interface";
import {LoggerService} from "../logger-service/logger.service";
import * as Highcharts from 'highcharts';
import {ChartItem} from "../../interfaces/chart.interface";

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  private chartDataSubject: AsyncSubject<ChartData | null> = new AsyncSubject<ChartData | null>();
  private chartSettingsSubject: AsyncSubject<ChartSettings> = new AsyncSubject<ChartSettings>();
  private chartOptionsSubject: AsyncSubject<Highcharts.Options> = new AsyncSubject<Highcharts.Options>();
  chartOptions: Highcharts.Options;
  chartList: ChartItem[] = [];

  constructor(
    private logger: LoggerService,
  ) {
    this.chartOptions = {};
    this.chartList = [];
  }

  // Updating charts data
  setChartData(data: ChartData | null): void {
    this.chartDataSubject.next(data);
    this.chartDataSubject.complete();
    this.logger.log('In ChartDataService chart data set: ', data);
  }

  // Updating the chart Settings
  setChartSettings(settings: ChartSettings): void {
    this.chartSettingsSubject.next(settings);
    this.chartSettingsSubject.complete();
    this.logger.log('In ChartDataService chart settings set', '!');
  }

  // Updating the chart options (for chart view)
  updateChartOptions(chartData: ChartData, chartSettings?: ChartSettings, chartId?: string): void {
    const chartIndex: number = this.chartList.findIndex((chart: ChartItem): boolean => chart.chartId === chartId);
    const chart = this.chartList[chartIndex]
    if (chart && chartSettings) {
      chart.chartSettings = chartSettings;
      chart.chartData = chartData;
      let titleText: string = chart.chartSettings.title || '';
      if (chart.chartData.chart.result[0] && chart.chartData.chart.result[0].comparisons[0]) {
        titleText = titleText.trim() === '' ? chart.chartData.chart.result[0].meta.symbol : titleText;
        this.chartOptions = {
          title: {
            text: titleText,
          },
          xAxis: {
            categories: chart.chartData.chart.result[0].timestamp.map(
              (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString()
            ),
          },
          yAxis: {
            title: {
              text: chart.chartData.chart.result[0].meta.currency,
            },
          },
          series: [
            {
              name: 'Closing price',
              type: chart.chartSettings.type,
              data: chart.chartData.chart.result[0].comparisons[0].close,
              color: chart.chartSettings.color,
            },
          ],
          accessibility: {
            enabled: true
          }
        }
      }
      this.chartOptionsSubject.next(this.chartOptions);
      this.chartOptionsSubject.complete()
      chart.chartOptions = this.chartOptions;
      this.logger.log('In ChartDataService chart options updated: ', this.chartOptions);
    }
  }

  getChartSettings(): Observable<ChartSettings> {
    this.logger.log('In ChartDataService chart settings got', '!');
    return this.chartSettingsSubject.asObservable();
  }

  addChart(chartSettings: ChartSettings, chartId: string, chartData: ChartData) {
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

  deleteChart(chartId: string) {
    const index = this.chartList.findIndex((chart: ChartItem): boolean => chart.chartId === chartId);
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
    let timestampData: number[] = [];
    let yAxisData: number[] = [];
    if (chartData.chart.result[0] && chartData.chart.result[0].comparisons[0]) {
      timestampData = chartData.chart.result[0].timestamp;
      yAxisData = chartData.chart.result[0].comparisons[0].close;
    }
    for (let i = 0; i < timestampData.length - 1; ++i) {
      const timestamp = timestampData[i];
      const yAxis = yAxisData[i];
      if (timestamp && yAxis) {
        const date: Date = new Date(timestamp * 1000);

        if (date >= startDate && date <= endDate) {
          filteredTimestamps.push(timestamp);
          filteredYAxisData.push(yAxis);
        }
      }
    }
    // Create a new chartData object with filtered data
    const filteredChartData: ChartData = {...chartData};
    if (filteredChartData.chart.result[0] && filteredChartData.chart.result[0].comparisons[0]) {
      filteredChartData.chart.result[0].timestamp = filteredTimestamps;
      filteredChartData.chart.result[0].comparisons[0].close = filteredYAxisData;
    }
    this.logger.log('In ChartDataService chartData filtered', filteredChartData);
    return filteredChartData;
  }
}
