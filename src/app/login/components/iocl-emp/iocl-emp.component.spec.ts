import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IoclEmpComponent } from './iocl-emp.component';

describe('IoclEmpComponent', () => {
  let component: IoclEmpComponent;
  let fixture: ComponentFixture<IoclEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IoclEmpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IoclEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
