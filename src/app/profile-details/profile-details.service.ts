import { Injectable } from '@angular/core';

@Injectable()
export class ProfileDetailsService {

  constructor() { }

  alphaOnly(event: KeyboardEvent) {
    const pattern = /^[a-zA-Z-']+$/;
    if (!pattern.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }
}
