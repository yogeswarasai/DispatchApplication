import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstCouriercontractComponent } from './mst-couriercontract.component';

describe('MstCouriercontractComponent', () => {
  let component: MstCouriercontractComponent;
  let fixture: ComponentFixture<MstCouriercontractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MstCouriercontractComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MstCouriercontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
