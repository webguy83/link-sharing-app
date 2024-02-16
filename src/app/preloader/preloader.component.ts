import { AsyncPipe } from '@angular/common';
import { LoadingService } from './../services/loading.service';

import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [MatProgressSpinnerModule, AsyncPipe],
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.scss',
})
export class PreloaderComponent {
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.isLoading$;
}
