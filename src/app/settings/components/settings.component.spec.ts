import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormBuilder } from "@angular/forms";
import { of } from 'rxjs';
import { SettingsComponent } from './settings.component';
import { ChartDataService } from '../../services/chart-data-service/chart-data.service';
import { ApiService } from '../../services/api-service/api.service';
import { LoggerService } from '../../services/logger-service/logger.service';
import { ChartData } from '../../interfaces/api.interface';
import { ChartSettings } from "../../interfaces/chart-settings.interface";
import { CreateNewChartComponent } from './create-new-chart/create-new-chart.component';
import { ChartComponent } from "./chart/chart.component";
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

describe('SettingsComponent', (): void => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let chartDataService: ChartDataService;
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;
  let chartSettings: ChartSettings;
  let mockDialog: MatDialog;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(waitForAsync((): void => {
    activatedRouteStub = {
      paramMap: of(convertToParamMap({ id: '1' })),
    };
    TestBed.configureTestingModule({
      declarations: [SettingsComponent, CreateNewChartComponent, ChartComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [
        ChartDataService,
        ApiService,
        LoggerService,
        FormBuilder,
        {
          provide: Router,
          useValue: {
            url: '/view-mode',
            navigate: (): void => {}
          }
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { chartSettings: chartSettings }
        },
        {
          provide: MatDialogRef,
          useValue: { close: (): void => {} }
        },
      ],
    });

    chartSettings = {
      ticker: 'AAPL',
      title: 'Apple',
      type: 'line',
      color: 'blue',
    };

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    chartDataService = TestBed.inject(ChartDataService);
    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockDialog = TestBed.inject(MatDialog);
  }));

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should load chart settings on ngOnInit', waitForAsync(async (): Promise<void> => {
    spyOn(chartDataService, 'getChartSettings').and.returnValue(of(chartSettings));
    await component.ngOnInit();
    expect(chartDataService.getChartSettings).toHaveBeenCalled();
    expect(component.chartSettings).toEqual(chartSettings);
  }));

  it('should open chart settings dialog', (): void => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRefSpyObj.afterClosed.and.returnValue(of({}));
    const mockDialogSpy = spyOn(mockDialog, 'open').and.returnValue(dialogRefSpyObj);
    component.openChartSettings();
    expect(mockDialogSpy).toHaveBeenCalledWith(CreateNewChartComponent, {
      width: '400px',
      height: '600px',
      panelClass: 'centered-dialog',
      position: {},
      autoFocus: false,
      data: {
        chartSettings: { ...component.chartSettings },
      }
    });
  });

  it('should create new chart', waitForAsync(async (): Promise<void> => {
    const response: ChartData = {
      chart: {
        result: [
          {
            meta: { currency: 'USD', symbol: 'AAPL' },
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
    spyOn(apiService, 'getData').and.returnValue(of(response));
    spyOn(chartDataService, 'setChartData');
    spyOn(chartDataService, 'setChartSettings');
    spyOn(chartDataService, 'addChart');
    spyOn(chartDataService, 'updateChartOptions');
    spyOn(component.logger, 'log');
    component.chartSettings = chartSettings;
    await component.createNewChart();
    await apiService.getData(chartSettings.ticker).toPromise();

    expect(chartDataService.setChartData).toHaveBeenCalledWith(response);
    expect(chartDataService.setChartSettings).toHaveBeenCalledWith(chartSettings);
    expect(chartDataService.addChart).toHaveBeenCalled();
    expect(chartDataService.updateChartOptions).toHaveBeenCalled();
    expect(component.logger.log).toHaveBeenCalledWith('In SettingComponent chart data got and new chart created', '!');
  }));
});
