import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierHistoryComponent } from './courier-history.component';

describe('CourierHistoryComponent', () => {
  let component: CourierHistoryComponent;
  let fixture: ComponentFixture<CourierHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourierHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
