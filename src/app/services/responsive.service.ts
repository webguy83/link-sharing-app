import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface BreakpointsDictionary {
  handset: string;
  tablet: string;
  web: string;
  max350: string;
  max400: string;
  max500: string;
  max700: string;
  max900: string;
}

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private breakpoints: BreakpointsDictionary = {
    handset: Breakpoints.Handset,
    tablet: Breakpoints.Tablet,
    web: Breakpoints.Web,
    max350: '(max-width: 350px)',
    max400: '(max-width: 400px)',
    max500: '(max-width: 500px)',
    max700: '(max-width: 700px)',
    max900: '(max-width: 900px)',
  };

  private breakpointSubjects: {
    [K in keyof BreakpointsDictionary]: BehaviorSubject<boolean>;
  } = {} as any;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.initializeBreakpointSubjects();
    this.setupBreakpointObservers();
  }

  private initializeBreakpointSubjects(): void {
    (
      Object.keys(this.breakpoints) as Array<keyof BreakpointsDictionary>
    ).forEach((key) => {
      this.breakpointSubjects[key] = new BehaviorSubject<boolean>(false);
    });
  }

  get isMobile(): Observable<boolean> {
    return this.breakpointSubjects['handset'].asObservable();
  }

  get isTablet(): Observable<boolean> {
    return this.breakpointSubjects['tablet'].asObservable();
  }

  get isDesktop(): Observable<boolean> {
    return this.breakpointSubjects['web'].asObservable();
  }

  get isCustomMax350(): Observable<boolean> {
    return this.breakpointSubjects['max350'].asObservable();
  }

  get isCustomMax400(): Observable<boolean> {
    return this.breakpointSubjects['max400'].asObservable();
  }

  get isCustomMax500(): Observable<boolean> {
    return this.breakpointSubjects['max500'].asObservable();
  }

  get isCustomMax700(): Observable<boolean> {
    return this.breakpointSubjects['max700'].asObservable();
  }

  get isCustomMax900(): Observable<boolean> {
    return this.breakpointSubjects['max900'].asObservable();
  }

  private setupBreakpointObservers(): void {
    (
      Object.keys(this.breakpoints) as Array<keyof BreakpointsDictionary>
    ).forEach((key) => {
      const breakpoint = this.breakpoints[key];
      this.breakpointObserver.observe([breakpoint]).subscribe((result) => {
        this.breakpointSubjects[key].next(result.matches);
      });
    });
  }
}
