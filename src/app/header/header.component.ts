import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { LoggerService } from "../services/logger-service/logger.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: LoggerService,
  ) {  };

  goToViewMode() {
    this.router.navigate(['/view-mode']);
    this.logger.log('User navigate to view-mode page', '!');
  };

  goToSettings() {
    this.router.navigate(['/settings']);
    this.logger.log('User navigate to settings page', '!');
  };
}
