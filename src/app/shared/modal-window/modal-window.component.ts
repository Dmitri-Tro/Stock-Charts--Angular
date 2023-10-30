import {Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ChartSettings} from "../../interfaces/chart-settings.interface";
import {ChartDataService} from "../../services/chart-data-service/chart-data.service";
import {LoggerService} from "../../services/logger-service/logger.service";
import {ChartItem} from "../../interfaces/chart.interface";

@Component({
  selector: 'app-modal-window',
  templateUrl: 'modal-window.component.html',
  styleUrls: ['modal-window.component.css']
})
export class ModalWindowComponent implements OnInit {
  modalWindowForm: FormGroup;
  chartSettings: ChartSettings;

  constructor(
    protected logger: LoggerService,
    protected dialogRef: MatDialogRef<ModalWindowComponent>,
    protected fb: FormBuilder,
    protected chartDataService: ChartDataService,
    @Inject(MAT_DIALOG_DATA) data: { chartSettings: ChartSettings },
  ) {
    this.modalWindowForm = this.fb.group({
      ticker: [''],
      title: [''],
      type: ['line'],
      color: ['blue'],
    });
    this.chartSettings = data.chartSettings;
    this.modalWindowForm.patchValue(this.chartSettings);
  }

// Initial form settings
  ngOnInit(): void {
    this.chartSettings = {
      ticker: '',
      title: '',
      type: 'line',
      color: 'blue',
    };
  }

  // Save the chart settings and close the modal window
  saveChartSettings(chartId?: string): void {
    const updatedSettings: ChartSettings = {...this.modalWindowForm.value};
    const chartList: ChartItem[] = this.chartDataService.getChartList;
    if (chartId) {
      const chartToUpdate: ChartItem | undefined = chartList.find((chart: ChartItem): boolean => chart.chartId === chartId);
      if (chartToUpdate) {
        updatedSettings.ticker = chartToUpdate.chartSettings.ticker;
      }
    }
    this.chartDataService.setChartSettings(updatedSettings);
    this.dialogRef.close(updatedSettings);
    this.logger.log('In ModalWindowComponent chart settings saved and sent to the ChartDataService: ', updatedSettings);
  }

// Closing a modal window without saving the settings
  closeDialog(): void {
    this.dialogRef.close();
  }
}
