import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpHistoryComponent } from './emp-history.component';

describe('EmpHistoryComponent', () => {
  let component: EmpHistoryComponent;
  let fixture: ComponentFixture<EmpHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmpHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
