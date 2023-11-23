// responsive.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private isMobileSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isTabletSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isDesktopSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isCustomMax500Subject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isCustomMax400Subject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isCustomMax700Subject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isMobile: Observable<boolean> = this.isMobileSubject.asObservable();
  isTablet: Observable<boolean> = this.isTabletSubject.asObservable();
  isDesktop: Observable<boolean> = this.isDesktopSubject.asObservable();
  isCustomMax500: Observable<boolean> =
    this.isCustomMax500Subject.asObservable();
  isCustomMax400: Observable<boolean> =
    this.isCustomMax400Subject.asObservable();
  isCustomMax700: Observable<boolean> =
    this.isCustomMax700Subject.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.setupBreakpointObservers();
  }

  setBodyStyle(property: string, value: string): void {
    (document.body.style as any)[property] = value;
  }

  private setupBreakpointObservers(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobileSubject.next(result.matches);
      });

    this.breakpointObserver
      .observe([Breakpoints.Tablet])
      .subscribe((result) => {
        this.isTabletSubject.next(result.matches);
      });

    this.breakpointObserver.observe([Breakpoints.Web]).subscribe((result) => {
      this.isDesktopSubject.next(result.matches);
    });

    this.breakpointObserver
      .observe(['(max-width: 500px)'])
      .subscribe((result) => {
        this.isCustomMax500Subject.next(result.matches);
      });

    this.breakpointObserver
      .observe(['(max-width: 400px)'])
      .subscribe((result) => {
        this.isCustomMax400Subject.next(result.matches);
      });

    this.breakpointObserver
      .observe(['(max-width: 700px)'])
      .subscribe((result) => {
        this.isCustomMax700Subject.next(result.matches);
      });
  }
}
