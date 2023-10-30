import {Component, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ChartSettingsComponent} from "./chart-settings/chart-settings.component";
import {ChartDataService} from "../../../services/chart-data-service/chart-data.service";
import {ChartSettings} from "../../../interfaces/chart-settings.interface";
import {LoggerService} from "../../../services/logger-service/logger.service";
import {ChartItem} from "../../../interfaces/chart.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit {
  isButtonDisabled = false;
  isViewMode = false;
  chartSettings: ChartSettings = {
    ticker: '',
    title: '',
    type: 'line',
    color: 'blue',
  };
  chartList: ChartItem[] = this.chartDataService.getChartList;
  private chartId = '';

  constructor(
    private dialog: MatDialog,
    protected chartDataService: ChartDataService,
    protected logger: LoggerService,
    private router: Router
  ) {  }

  // Highcharts initialization
  Highcharts: typeof Highcharts = Highcharts;

  // ChartComponent is also used in ViewModule, during initialization check this page and if is "/view-mode" - hide the buttons of chart settings.
  ngOnInit(): void {
    const currentPath: string = this.router.url;
    this.isViewMode = currentPath.includes('/view-mode');
  }

  // Modal window view settings
  openChartSettings(chartId: string): void {
    this.isButtonDisabled = true;
    this.chartId = chartId;
    const chartToUpdate: ChartItem | undefined = this.chartList.find((chart: ChartItem): boolean => chart.chartId === chartId);
    if (chartToUpdate) {
      const dialogRef: MatDialogRef<ChartSettingsComponent> = this.dialog.open(ChartSettingsComponent, {
        width: '400px',
        height: '500px',
        panelClass: 'centered-dialog',
        position: {},
        autoFocus: false,
        data: {
          chartSettings: this.chartSettings,
        },
      });
      // Operations after closing a modal window
      dialogRef.afterClosed().subscribe((result): void => {
        this.isButtonDisabled = false;
        this.chartDataService.updateChartOptions(chartToUpdate.chartData, result, this.chartId);
        this.logger.log('In ChartComponent chart settings saved and sent to the ChartDataService: ', result);
      });
    }
  }

  deleteChart(chartId: string): void {
    this.chartDataService.deleteChart(chartId);
  }
}
