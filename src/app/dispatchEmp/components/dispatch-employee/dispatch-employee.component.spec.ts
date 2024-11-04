import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchEmployeeComponent } from './dispatch-employee.component';

describe('DispatchEmployeeComponent', () => {
  let component: DispatchEmployeeComponent;
  let fixture: ComponentFixture<DispatchEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatchEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
