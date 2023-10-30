import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../../services/api-service/api.service";
import {MatDialog} from "@angular/material/dialog";
import {SettingsComponent} from "../../../settings/components/settings.component";
import {ChartDataService} from "../../../services/chart-data-service/chart-data.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LoggerService} from "../../../services/logger-service/logger.service";
import {MatCalendarView} from "@angular/material/datepicker";
import {ChartItem} from "../../../interfaces/chart.interface";
import {ChartData} from "../../../interfaces/api.interface";
import {DatePickerOptions} from "../../../interfaces/datePickerOptions.interface";

@Component({
  selector: 'app-view-mode',
  templateUrl: './view-mode.component.html',
  styleUrls: ['./view-mode.component.css'],
})
export class ViewModeComponent extends SettingsComponent implements OnInit {
  filterForm: FormGroup;
  chartList: ChartItem[] = [];

  constructor(
    dialog: MatDialog,
    apiService: ApiService,
    chartDataService: ChartDataService,
    logger: LoggerService,
    private formBuilder: FormBuilder,
  ) {
    super(dialog, chartDataService, apiService, logger);
    this.filterForm = this.formBuilder.group({
      startDate: [null],
      endDate: [null],
    });
  }

  // Date pickers settings
  startDatePickerOptions: DatePickerOptions = {
    panelClass: 'custom-datepicker',
    startView: 'month' as MatCalendarView,
    touchUi: true,
  };
  endDatePickerOptions: DatePickerOptions = {
    panelClass: 'custom-datepicker',
    startView: 'month' as MatCalendarView,
    touchUi: true,
  };

  // At page initialization accepts installed graphics and their settings (on "/settings" page)
  override ngOnInit(): void {
    this.chartList = this.chartDataService.getChartList;
    this.logger.log('In ViewModeComponent charts and charts settings received: ', this.chartList);
  }

  startDatePickerOpen = false;
  endDatePickerOpen = false;

  // Apply date filter
  applyDateFilter(): void {
    const startDateField = this.filterForm.get('startDate');
    const endDateField = this.filterForm.get('endDate');
    let startDate: Date;
    let endDate: Date;
    if (startDateField && endDateField) {
      startDate = startDateField.value;
      endDate = endDateField.value;
      endDate.setDate(endDate.getDate() + 1);
    }
    // Apply date filter to each chart in the list
    this.chartList.forEach((chart: ChartItem): void => {
      if (chart.chartData) {
        const filteredChartData: ChartData = this.chartDataService.filterChartData(
          chart.chartData,
          startDate,
          endDate
        );
        this.chartDataService.updateChartOptions(filteredChartData, chart.chartSettings, chart.chartId);
        // Updating charts data
        this.chartDataService.setChartData(filteredChartData);
      }
    });
    startDateField?.reset();
    endDateField?.reset();
  }
}
