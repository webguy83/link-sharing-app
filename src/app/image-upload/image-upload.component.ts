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
  @Output() imageSelected = new EventEmitter<string>();
  imagePreview: string | ArrayBuffer | null = null; // Initialized to null

  onChange = (fileName: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    // Handle the incoming value (if needed)
  }

  registerOnChange(fn: (fileName: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  handleImageInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length) {
      const file = element.files[0];
      // Validate file size and type here

      // Use FileReader to read the file for preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.onChange(file.name);
        this.imageSelected.emit(file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  // Additional methods for validation and error handling
}
