import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSharingDashboardComponent } from './link-sharing-dashboard.component';

describe('LinkSharingDashboardComponent', () => {
  let component: LinkSharingDashboardComponent;
  let fixture: ComponentFixture<LinkSharingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkSharingDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkSharingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
