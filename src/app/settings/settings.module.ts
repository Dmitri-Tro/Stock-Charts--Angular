import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from "./components/settings.component";
import { ChartSettingsComponent } from "./components/chart/chart-settings/chart-settings.component";
import { ChartComponent } from "./components/chart/chart.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from "highcharts-angular";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { CreateNewChartComponent } from './components/create-new-chart/create-new-chart.component';

@NgModule({
  declarations: [
    SettingsComponent,
    ChartComponent,
    ChartSettingsComponent,
    CreateNewChartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HighchartsChartModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  exports: [ChartSettingsComponent, ChartComponent],
})
export class SettingsModule { }
