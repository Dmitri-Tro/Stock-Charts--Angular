import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartDataService } from './chart-data.service';
import {ChartSettings} from "../../interfaces/chart-settings.interface";
import {ChartData} from "../../interfaces/api.interface";
import {ChartItem} from "../../interfaces/chart.interface";

describe('ChartDataService', (): void => {
  let service: ChartDataService;
  let chartData: ChartData;
  let chartSettings: ChartSettings;
  let chartId: string;
  let startDate: Date;
  let endDate: Date;
  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ChartDataService);
    chartData = {
      chart: {
        result: [
          {
            meta: {
              currency: 'USD',
              symbol: 'AAPL',
            },
            timestamp: [1234567890, 1234567891, 1234567892],
            comparisons: [
              {
                symbol: 'AAPL',
                high: [100, 101, 102],
                low: [90, 91, 92],
                open: [95, 96, 97],
                close: [98, 99, 100],
              },
            ],
          },
        ],
      },
    };
  });
    chartSettings = {
      ticker: 'AAPL',
      title: 'Apple',
      type: 'line',
      color: 'red',
    };
  chartId = 'chart';
  startDate = new Date(2 * 1000);
  endDate = new Date(4 * 1000);

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should update chart options', (): void => {
    service.addChart(chartSettings, chartId, chartData);
    service.updateChartOptions(chartSettings, chartId, chartData);
    const chart: ChartItem | undefined = service.getChartList.find((c: ChartItem): boolean => c.chartId === chartId);
    if (chart) {
      expect(chart.chartSettings).toEqual(chartSettings);
      expect(chart.chartOptions).toBeTruthy();
    } else {
      fail('Chart not found in chart list.');
    }
  });

  it('should update chart options with empty title if chartSettings.title is empty', (): void => {
      const chartSettings: ChartSettings = {
        ticker: 'AAPL',
        title: '',
        type: 'line',
        color: 'red',
      };
      service.addChart(chartSettings, chartId, chartData);
        service.updateChartOptions(chartSettings, chartId, chartData);
        const titleText: string = service['chartOptions'].title?.text || '';
        expect(titleText).toEqual(chartSettings.ticker);
    });

  it('should set chart data', (): void => {
    service.setChartData(chartData);
    expect(service['chartDataSubject'].value).toEqual(chartData);
  });

  it('should set chart settings', (): void => {
    service.setChartSettings(chartSettings);
    expect(service['chartSettingsSubject'].value).toEqual(chartSettings);
  });

  it('should get chart settings', (): void => {
    service.setChartSettings(chartSettings);
    service.getChartSettings().subscribe((settings: ChartSettings): void => {
      expect(settings).toEqual(chartSettings);
    });
  });

  it('should add chart to chart list', (): void => {
    service.addChart(chartSettings, chartId, chartData);
    const chart: ChartItem | undefined = service.getChartList.find((c: ChartItem): boolean => c.chartId === chartId);
    expect(chart).toBeTruthy();
    if (chart) {
      expect(chart.chartSettings).toEqual(chartSettings);
      expect(chart.chartData).toEqual(chartData);
      expect(chart.chartOptions).toBeTruthy();
    }else {
      fail('Chart not found in chart list.');
    }
  });

  it('should delete chart from chart list', (): void => {
    service.addChart(chartSettings, chartId, chartData);
    service.deleteChart(chartId);
    const chart: ChartItem | undefined = service.getChartList.find((c: ChartItem): boolean => c.chartId === chartId);
    expect(chart).toBeFalsy();
  });

  it('should return the same chartData when no filtering is needed', (): void => {
    const startDate: Date = new Date(0);
    const endDate: Date = new Date(9999999999);
    const filteredChartData: ChartData = service.filterChartData(chartData, chartSettings, startDate, endDate);
    expect(filteredChartData).toEqual(chartData);
  });

  it('should filter chart data by date', (): void => {
    const testData: ChartData = {
      chart: {
        result: [
          {
            meta: { currency: 'USD', symbol: 'AAPL' },
            timestamp: [1, 2, 3, 4, 5],
            comparisons: [
              { symbol: 'AAPL', high: [], low: [], open: [], close: [10, 20, 30, 40, 50] },
            ],
          },
        ],
      },
    };
    const filteredChartData: ChartData = service.filterChartData(testData, chartSettings, startDate, endDate);
    expect(filteredChartData.chart.result[0].timestamp).toEqual([2, 3, 4]);
    expect(filteredChartData.chart.result[0].comparisons[0].close).toEqual([20, 30, 40]);
  });
});
