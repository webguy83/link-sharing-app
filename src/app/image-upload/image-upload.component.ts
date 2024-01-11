import { CommonModule } from '@angular/common';
import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true,
    },
  ],
})
export class ImageUploadComponent implements ControlValueAccessor {
  @Output() imageSelected = new EventEmitter<File>();
  imagePreview: string | ArrayBuffer | null = null; // Initialized to null

  onTouched = () => {};

  writeValue(value: string): void {
    // Handle the incoming value (if needed)
  }

  onChange: (value: File | null) => void = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  clearImage(event: Event): void {
    event.stopPropagation();
    this.imagePreview = null;
    this.onChange(null);
    // Additional logic if needed
  }

  handleImageInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length) {
      const file = element.files[0];

      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        // Invalid file type
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target;
        if (!target) return;

        const img = new Image();
        img.onload = () => {
          if (img.width > 1024 || img.height > 1024) {
            // Image dimensions are larger than 1024x1024px
            return;
          }

          // Valid image, set for preview
          this.imagePreview = target.result;
          this.onChange(file);
          this.imageSelected.emit(file);
        };
        img.src = target.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
