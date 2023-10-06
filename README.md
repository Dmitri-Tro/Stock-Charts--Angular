# Charts

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.4.

# Application description
Application for creating charts of stock exchange prices.

Application Logic:
On the page `/settings` create, customize or delete charts. On the page `/view-mode` - use charts in the viewing mode with the ability to filter data in specified time intervals.

The data for charts is taken from [Yahoo Finance](https://financeapi.net). Unfortunately, my tariff plan allows to get data only on Apple and Microsoft shares and only for the last month. Therefore, when testing the application, when creating new charts, enter one of the two possible tickers for Apple - `AAPL` and for Microsoft - `MSFT`. The functionality of the application, of course, allows you to query data for any companies listed on the US stock exchange. To do this, need to change data plan.
In addition, `ApiKey` is changed by the service weekly, so when testing you will possibly have to ask me for a new key. Or register on the service and enter yours in the application's `ApiService` :)

Charts settings (display of the received data) are made using the [Highcharts](https://highcharts.com) library and are set by the user. In this case, there is an opportunity to change the name of the chart, color and type, and for color and type there is an opportunity to choose only from two options, although the library allows to customize charts much more diverse. But for demonstration purposes, I think this functionality is enough. :)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
