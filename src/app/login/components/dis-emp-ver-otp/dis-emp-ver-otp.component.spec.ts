import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisEmpVerOtpComponent } from './dis-emp-ver-otp.component';

describe('DisEmpVerOtpComponent', () => {
  let component: DisEmpVerOtpComponent;
  let fixture: ComponentFixture<DisEmpVerOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisEmpVerOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisEmpVerOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
