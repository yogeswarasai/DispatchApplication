import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisMonthlyReportsComponent } from './dis-monthly-reports.component';

describe('DisMonthlyReportsComponent', () => {
  let component: DisMonthlyReportsComponent;
  let fixture: ComponentFixture<DisMonthlyReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisMonthlyReportsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisMonthlyReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
