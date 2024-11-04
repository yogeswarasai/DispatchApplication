import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpDispatchDetailsComponent } from './emp-dispatch-details.component';

describe('EmpDispatchDetailsComponent', () => {
  let component: EmpDispatchDetailsComponent;
  let fixture: ComponentFixture<EmpDispatchDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpDispatchDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpDispatchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
