import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisEmpComponent } from './dis-emp.component';

describe('DisEmpComponent', () => {
  let component: DisEmpComponent;
  let fixture: ComponentFixture<DisEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisEmpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
