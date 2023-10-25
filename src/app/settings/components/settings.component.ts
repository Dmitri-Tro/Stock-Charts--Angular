import {Component, OnDestroy, OnInit} from '@angular/core';
import { CreateNewChartComponent } from "./create-new-chart/create-new-chart.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ChartSettings } from "../../interfaces/chart-settings.interface";
import { ChartDataService } from "../../services/chart-data-service/chart-data.service";
import { ChartData } from "../../interfaces/api.interface";
import { ApiService } from "../../services/api-service/api.service";
import { LoggerService } from "../../services/logger-service/logger.service";
import * as uuid from "uuid";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  chartData: ChartData | null = null;
  chartId: string = '';
  isButtonDisabled: boolean = false;
  chartSettings: ChartSettings = {
    ticker: '',
    title: '',
    type: 'line',
    color: 'blue',
  };

  protected chartSettingsSubscription!: Subscription;
  protected chartDataSubscription!: Subscription;
  private modalWindowAfterClose!: Subscription

  constructor(
    public dialog: MatDialog,
    protected chartDataService: ChartDataService,
    protected apiService: ApiService,
    public logger: LoggerService,
  ) {
  }

// When we open settings page, load chart settings
  ngOnInit(): void {
    this.chartSettingsSubscription = this.chartDataService.getChartSettings().subscribe((settings: ChartSettings): void => {
      this.chartSettings = settings;
    });
  }
// Unsubscribe when component destroyed
  ngOnDestroy(): void{
    this.chartSettingsSubscription.unsubscribe();
    this.chartDataSubscription.unsubscribe();
    this.modalWindowAfterClose.unsubscribe();
  }

  // Modal window view settings
  openChartSettings(): void {
    this.isButtonDisabled = true;
    const dialogRef: MatDialogRef<CreateNewChartComponent> = this.dialog.open(CreateNewChartComponent, {
      width: '400px',
      height: '600px',
      panelClass: 'centered-dialog',
      position: {},
      autoFocus: false,
      data: {
        chartSettings: {...this.chartSettings},
      }
    });

    this.modalWindowAfterClose = dialogRef.afterClosed().subscribe((result): void => {
      this.isButtonDisabled = false;
      if (result) {
        this.createNewChart();
      }
    });
  }

  createNewChart(): void {
    if (this.chartSettings.ticker)
      this.chartDataSubscription = this.apiService.getData(this.chartSettings.ticker).subscribe((response: ChartData): void => {
        this.chartData = response;
        this.chartDataService.setChartData(this.chartData);
        const chartSettingsCopy: ChartSettings = {...this.chartSettings};
        this.chartId = uuid.v4()
        this.chartDataService.setChartSettings(chartSettingsCopy);
        this.chartDataService.addChart(chartSettingsCopy, this.chartId, this.chartData);
        this.chartDataService.updateChartOptions(chartSettingsCopy, this.chartId, this.chartData);
        this.logger.log('In SettingComponent chart data got and new chart created', '!');
      });
  }
}
