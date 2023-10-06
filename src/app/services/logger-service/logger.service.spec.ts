import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('LoggerService', (): void => {
  let service: LoggerService;
  beforeEach((): void => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });
});
