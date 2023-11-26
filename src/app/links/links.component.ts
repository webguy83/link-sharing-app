import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss',
})
export class LinksComponent {}
