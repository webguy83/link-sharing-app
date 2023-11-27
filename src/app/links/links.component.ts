import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss',
})
export class LinksComponent {
  isMaxWidth500$ = this.responsiveService.isCustomMax500;

  constructor(private responsiveService: ResponsiveService) {}
}
