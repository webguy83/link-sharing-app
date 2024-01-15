import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
})
export class LinkComponent {
  @Input() bgColour!: string;
  @Input() platform!: string;
  @Input() iconPath!: string;
  @Input() extraPadding = false;

  get arrowPath() {
    const extraDomain = this.platform === 'Frontend Mentor' ? 'alternate/' : '';
    return `../../assets/images/${extraDomain}icon-arrow-right.svg`;
  }
}
