import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { platformOptions } from '../shared/constants/platform-option';

@Component({
  selector: 'app-link-block',
  templateUrl: './link-block.component.html',
  styleUrls: ['./link-block.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LinkBlockComponent {
  platformOptions = platformOptions;

  @Input() linkFormGroup: FormGroup = new FormGroup({});
  @Input() index!: number;
  @Output() remove = new EventEmitter<void>();

  ngOnInit(): void {
    if (!this.linkFormGroup) {
      console.error('linkFormGroup is required for LinkBlockComponent');
    }
  }

  onRemove(): void {
    this.remove.emit();
  }
}
