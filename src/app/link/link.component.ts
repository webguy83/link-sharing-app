import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LinkBlock } from '../shared/models/basics.model';

@Component({
  selector: 'app-link',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
})
export class LinkComponent {
  @Input() linkBlock!: LinkBlock;
  @Input() extraPadding = false;
  @Input() enableClick = true;

  get arrowPath() {
    const extraDomain =
      this.linkBlock.label === 'Frontend Mentor' ? 'alternate/' : '';
    return `../../assets/images/${extraDomain}icon-arrow-right.svg`;
  }

  openLink(url: string): void {
    if(url && this.enableClick) {
      window.open(url, '_blank');
    }

  }
}
