import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChartData} from "../../interfaces/api.interface";
import {LoggerService} from "../logger-service/logger.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiKey = 'o31F2jLjhn5YUpMnS0AxO9j42rdUpZxV1Utsqcqi';

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
  ) {  }

  // Data request for the chart
  getData(ticker: string): Observable<ChartData> {
    const headers: HttpHeaders = new HttpHeaders().set('x-api-key', this.apiKey);
    const fullUrl: string = 'https://yfapi.net/v8/finance/chart/' + ticker + '?comparisons=MSFT%2C%5EVIX&range=1mo&region=US&interval=1d&lang=en&events=div%2Csplit';
    this.logger.log('In ApiService created chart data obtained', '!');
    return this.http.get<ChartData>(fullUrl, {headers});
  }
}
