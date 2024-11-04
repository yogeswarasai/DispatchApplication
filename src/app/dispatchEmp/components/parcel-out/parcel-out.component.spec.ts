import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelOutComponent } from './parcel-out.component';

describe('ParcelOutComponent', () => {
  let component: ParcelOutComponent;
  let fixture: ComponentFixture<ParcelOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelOutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParcelOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
