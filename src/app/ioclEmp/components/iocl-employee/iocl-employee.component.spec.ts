import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IoclEmployeeComponent } from './iocl-employee.component';

describe('IoclEmployeeComponent', () => {
  let component: IoclEmployeeComponent;
  let fixture: ComponentFixture<IoclEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IoclEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IoclEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
