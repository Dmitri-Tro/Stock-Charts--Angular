import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MatDialogModule, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {HighchartsChartModule} from 'highcharts-angular';
import {of} from 'rxjs';
import {ChartComponent} from './chart.component';
import {ChartDataService} from '../../../services/chart-data-service/chart-data.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChartSettingsComponent} from "./chart-settings/chart-settings.component";

describe('ChartComponent', (): void => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let chartDataService: ChartDataService;
  let dialogRefSpyObj: jasmine.SpyObj<MatDialogRef<ChartSettingsComponent>>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const chartDataServiceMock = {
    getChartList: [
      {
        chartId: '1',
        chartData: {
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
        },
        chartSettings: {
          ticker: 'AAPL',
          title: 'Apple',
          type: 'line',
          color: 'red',
        },
        chartOptions: {},
      },
      {
        chartId: '2',
        chartData: {
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
        },
        chartSettings: {
          ticker: 'AAPL',
          title: 'Apple',
          type: 'line',
          color: 'red',
        },
        chartOptions: {},
      },
    ],
    updateChartOptions: jasmine.createSpy('updateChartOptions'),
    deleteChart: jasmine.createSpy('deleteChart'),
  };

  beforeEach(waitForAsync((): void => {
    dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRefSpyObj.afterClosed.and.returnValue(of({}));
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    TestBed.configureTestingModule({
      declarations: [ChartComponent],
      imports: [MatDialogModule, HighchartsChartModule, BrowserAnimationsModule],
      providers: [
        {
          provide: ChartDataService,
          useValue: chartDataServiceMock,
        },
        {
          provide: MatDialogRef,
          useValue: dialogRefSpyObj,
        },
        {
          provide: MatDialog,
          useValue: dialogSpy,
        },
      ],
    }).compileComponents();
  }));

  beforeEach((): void => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    chartDataService = TestBed.inject(ChartDataService);
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should open chart settings', (): void => {
    const chartId = '1';
    component.openChartSettings(chartId);
    expect(dialogSpy.open).toHaveBeenCalledWith(ChartSettingsComponent, {
      width: '400px',
      height: '500px',
      panelClass: 'centered-dialog',
      position: {},
      autoFocus: false,
      data: {
        chartSettings: {...component.chartSettings},
      },
    });
  });

  it('should delete chart', (): void => {
    const chartId = '1';
    component.deleteChart(chartId);
    expect(chartDataService.deleteChart).toHaveBeenCalledWith(chartId);
  });
});
