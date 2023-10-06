import { Component } from '@angular/core';
import { ModalWindowComponent } from "../../../../shared/modal-window/modal-window.component";
import { ChartItem } from "../../../../interfaces/chart.interface";

@Component({
  selector: 'app-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.css'],
})
export class ChartSettingsComponent extends ModalWindowComponent {
chartList: ChartItem[] = this.chartDataService.getChartList;
}

