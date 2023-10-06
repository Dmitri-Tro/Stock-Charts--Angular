import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateNewChartComponent } from './create-new-chart.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatRadioModule} from "@angular/material/radio";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('CreateNewChartComponent', (): void => {
  let component: CreateNewChartComponent;
  let fixture: ComponentFixture<CreateNewChartComponent>;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      declarations: [CreateNewChartComponent],
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
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(CreateNewChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
