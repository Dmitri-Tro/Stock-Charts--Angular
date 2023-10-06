import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChartSettingsComponent } from './chart-settings.component';

describe('ChartSettingsComponent', (): void => {
  let component: ChartSettingsComponent;
  let fixture: ComponentFixture<ChartSettingsComponent>;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      declarations: [ChartSettingsComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(ChartSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
