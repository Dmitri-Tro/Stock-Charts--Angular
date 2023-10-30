import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {ModalWindowComponent} from './modal-window.component';
import {ChartDataService} from '../../services/chart-data-service/chart-data.service';
import {LoggerService} from '../../services/logger-service/logger.service';
import {ChartSettings} from "../../interfaces/chart-settings.interface";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatRadioModule} from "@angular/material/radio";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ChartItem} from "../../interfaces/chart.interface";

describe('ModalWindowComponent', (): void => {
  let component: ModalWindowComponent;
  let fixture: ComponentFixture<ModalWindowComponent>;
  let dialogRef: MatDialogRef<ModalWindowComponent>;

  const testSettings: ChartSettings = {
    ticker: 'AAPL',
    title: 'Apple',
    type: 'area',
    color: 'red'
  };
  const chartToUpdate: ChartItem = {
    chartId: 'chart1',
    chartSettings: {
      ticker: 'AAPL',
      title: 'Apple',
      type: 'area',
      color: 'red',
    },
    chartData: {
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
    },
    chartOptions: {},
  };

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [ModalWindowComponent],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        },
        ChartDataService,
        {
          provide: LoggerService,
          useValue: {
            log: jasmine.createSpy('log')
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: testSettings
        }
      ]
    }).compileComponents();
  });

  beforeEach((): void => {
    fixture = TestBed.createComponent(ModalWindowComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should update ticker and title', (): void => {
    const setChartSettingsSpy = spyOn(component['chartDataService'], 'setChartSettings');
    component.modalWindowForm.patchValue({
      ticker: chartToUpdate.chartSettings.ticker,
      title: chartToUpdate.chartSettings.title,
      type: chartToUpdate.chartSettings.type,
      color: chartToUpdate.chartSettings.color,
    });
    component['chartDataService'].chartList = [chartToUpdate];
    component.saveChartSettings('chart1');
    expect(setChartSettingsSpy).toHaveBeenCalledWith(testSettings);
  });

  it('should close the dialog', (): void => {
    component.closeDialog();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
