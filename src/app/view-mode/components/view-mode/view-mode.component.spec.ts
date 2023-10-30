import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ViewModeComponent} from './view-mode.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ReactiveFormsModule} from '@angular/forms';
import {ChartDataService} from '../../../services/chart-data-service/chart-data.service';
import {ChartItem} from '../../../interfaces/chart.interface';
import {ChartData} from '../../../interfaces/api.interface';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {OverlayModule, ScrollStrategyOptions} from "@angular/cdk/overlay";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ChartComponent} from "../../../settings/components/chart/chart.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {ChartSettings} from "../../../interfaces/chart-settings.interface";

describe('ViewModeComponent', (): void => {
  let component: ViewModeComponent;
  let fixture: ComponentFixture<ViewModeComponent>;
  let chartDataService: ChartDataService;

  const mockChartData: ChartData = {
    chart: {
      result: [
        {
          meta: {currency: 'USD', symbol: 'AAPL'},
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
  const mockChartSettings: ChartSettings = {
    ticker: "AAPL",
    title: "Apple",
    type: 'area',
    color: 'red',
  };
  const mockChartId = "chart1"
  const mockChartItem: ChartItem = {
    chartId: 'chart1',
    chartSettings: {
      ticker: 'AAPL',
      title: 'Apple',
      type: 'area',
      color: 'red',
    },
    chartData: mockChartData,
    chartOptions: {},
  };

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [ViewModeComponent, ChartComponent],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        OverlayModule,
        HttpClientTestingModule,
      ],
      providers: [
        ChartDataService,
        MatDialog,
        {provide: MatDialogRef, useValue: {}},
        {provide: MAT_DIALOG_DATA, useValue: {}},
        ScrollStrategyOptions,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewModeComponent);
    component = fixture.componentInstance;
    chartDataService = TestBed.inject(ChartDataService);
    chartDataService['chartList'] = [mockChartItem];
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should apply date filter correctly', (): void => {
    component.filterForm.patchValue({
      startDate: new Date(2023, 0, 1),
      endDate: new Date(2023, 0, 3),
    });
    const filterChartDataSpy = spyOn(chartDataService, 'filterChartData').and.returnValue(mockChartData);
    const updateChartOptionsSpy = spyOn(chartDataService, 'updateChartOptions');
    const setChartDataSpy = spyOn(chartDataService, 'setChartData');
    component.applyDateFilter();
    expect(filterChartDataSpy).toHaveBeenCalledWith(mockChartData, new Date(2023, 0, 1), new Date(2023, 0, 4));
    expect(updateChartOptionsSpy).toHaveBeenCalledWith(mockChartData, mockChartSettings, mockChartId);
    expect(setChartDataSpy).toHaveBeenCalledWith(mockChartData);
  });
});
