
import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-preloader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.scss'
})
export class PreloaderComponent {
  @Input() isLoading: boolean = false;
}
