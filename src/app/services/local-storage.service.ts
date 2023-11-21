import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  setItem(key: string, value: any): void {
    try {
      const jsonString = JSON.stringify(value);
      localStorage.setItem(key, jsonString);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const jsonString = localStorage.getItem(key);
      return jsonString ? (JSON.parse(jsonString) as T) : null;
    } catch (error) {
      console.error('Error getting data from localStorage', error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
