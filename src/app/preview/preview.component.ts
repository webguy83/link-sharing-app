import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from '../services/state.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent implements OnInit {
  profile$ = this.appStateService.profile$;
  links$ = this.appStateService.links$;
  constructor(
    private appStateService: AppStateService, // This should provide user and links data
    private router: Router
  ) {}

  ngOnInit() {}

  navigateTo(url: string) {
    // Logic to navigate to the link's URL
    window.open(url, '_blank');
  }

  shareLink() {
    // Logic to share the link
  }
}
