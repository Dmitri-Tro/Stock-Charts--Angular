import {TestBed} from '@angular/core/testing';
import {ApiService} from './api.service';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';
import {ChartData} from '../../interfaces/api.interface';
import {LoggerService} from '../logger-service/logger.service';
import {HttpClientModule} from "@angular/common/http";

describe('ApiService', (): void => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [ApiService, LoggerService],
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach((): void => {
    httpTestingController.verify();
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  it('should fetch chart data', (): void => {
    const fakeChartData: ChartData = {
      chart: {
        result: [
          {
            meta: {
              currency: 'USD',
              symbol: 'AAPL',
            },
            timestamp: [123456789],
            comparisons: [
              {
                symbol: 'AAPL',
                high: [100],
                low: [90],
                open: [95],
                close: [98],
              },
            ],
          },
        ],
      },
    };
    const ticker = 'AAPL';
    service.getData(ticker).subscribe((data: ChartData): void => {
      expect(data).toEqual(fakeChartData);
    });
    const expectedUrl = 'https://yfapi.net/v8/finance/chart/AAPL?comparisons=MSFT%2C%5EVIX&range=1mo&region=US&interval=1d&lang=en&events=div%2Csplit';
    const req: TestRequest = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(fakeChartData);
    httpTestingController.verify();
  });
});
