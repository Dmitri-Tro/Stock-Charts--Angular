import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger-service/logger.service';
import { ViewModeComponent } from "../view-mode/components/view-mode/view-mode.component";
import { SettingsComponent } from "../settings/components/settings.component";

describe('HeaderComponent', (): void => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let logger: LoggerService;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule.withRoutes([
        {
          path: '',
          redirectTo: '/view-mode',
          pathMatch: 'full'
        },
        {
          path: '',
          component: HeaderComponent,
          children: [
            {
              path: 'view-mode',
              component: ViewModeComponent
            },
            {
              path: 'settings',
              component: SettingsComponent
            }
          ]
        }
      ]),],
      providers: [LoggerService]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    logger = TestBed.inject(LoggerService);

    fixture.detectChanges();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });

  it('should navigate to view mode', (): void => {
    spyOn(router, 'navigate');
    component.goToViewMode();
    expect(router.navigate).toHaveBeenCalledWith(['/view-mode']);
  });

  it('should log navigation to view mode', (): void => {
    spyOn(logger, 'log');
    component.goToViewMode();
    expect(logger.log).toHaveBeenCalledWith('User navigate to view-mode page', '!');
  });

  it('should navigate to settings', (): void => {
    spyOn(router, 'navigate');
    component.goToSettings();
    expect(router.navigate).toHaveBeenCalledWith(['/settings']);
  });

  it('should log navigation to settings', (): void => {
    spyOn(logger, 'log');
    component.goToSettings();
    expect(logger.log).toHaveBeenCalledWith('User navigate to settings page', '!');
  });
});
