import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  private _formChanged = signal(false);

  readonly formChanged = computed(() => this._formChanged());

  setFormChanged(state: boolean): void {
    this._formChanged.set(state);
  }
}
