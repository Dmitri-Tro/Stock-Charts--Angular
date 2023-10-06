import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewModeComponent } from "./components/view-mode/view-mode.component";
import { MatButtonModule } from "@angular/material/button";
import { SettingsModule } from "../settings/settings.module";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ReactiveFormsModule } from "@angular/forms";
import { HighchartsChartModule } from "highcharts-angular";

@NgModule({
  declarations: [
    ViewModeComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    SettingsModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    HighchartsChartModule
  ]
})
export class ViewModeModule { }
