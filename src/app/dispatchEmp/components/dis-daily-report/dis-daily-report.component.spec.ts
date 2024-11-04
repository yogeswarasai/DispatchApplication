import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisDailyReportComponent } from './dis-daily-report.component';

describe('DisDailyReportComponent', () => {
  let component: DisDailyReportComponent;
  let fixture: ComponentFixture<DisDailyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisDailyReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisDailyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
