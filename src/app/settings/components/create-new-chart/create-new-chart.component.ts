import {Component, Inject} from '@angular/core';
import {ModalWindowComponent} from "../../../shared/modal-window/modal-window.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {ChartDataService} from "../../../services/chart-data-service/chart-data.service";
import {ChartSettings} from "../../../interfaces/chart-settings.interface";
import {LoggerService} from "../../../services/logger-service/logger.service";

@Component({
  selector: 'app-create-new-chart',
  templateUrl: './create-new-chart.component.html',
  styleUrls: ['./create-new-chart.component.css'],
})
export class CreateNewChartComponent extends ModalWindowComponent {
  constructor(
    dialogRef: MatDialogRef<ModalWindowComponent>,
    fb: FormBuilder,
    chartDataService: ChartDataService,
    logger: LoggerService,
    @Inject(MAT_DIALOG_DATA) data: { chartSettings: ChartSettings }
  ) {
    super(logger, dialogRef, fb, chartDataService, data);
    // Just change modal window form
    this.modalWindowForm = this.fb.group({
      ticker: [''],
      title: [''],
      type: ['line'],
      color: ['blue'],
    });
  }
}
