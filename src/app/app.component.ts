import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fadeInOutAnimation } from './animations/route-animations';
import { PreloaderComponent } from './preloader/preloader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PreloaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInOutAnimation],
})
export class AppComponent {}
