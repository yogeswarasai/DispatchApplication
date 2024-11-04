import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisEmpReqOtpComponent } from './dis-emp-req-otp.component';

describe('DisEmpReqOtpComponent', () => {
  let component: DisEmpReqOtpComponent;
  let fixture: ComponentFixture<DisEmpReqOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisEmpReqOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisEmpReqOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
