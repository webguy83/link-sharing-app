import { Component } from '@angular/core';

import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { fadeInOutAnimation } from './animations/route-animations';
import { PreloaderComponent } from './preloader/preloader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PreloaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOutAnimation],
})
export class AppComponent {
  isLoading = false;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ) {
        this.isLoading = false;
      }
    });
  }
}
