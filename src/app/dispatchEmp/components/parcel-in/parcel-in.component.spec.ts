import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelInComponent } from './parcel-in.component';

describe('ParcelInComponent', () => {
  let component: ParcelInComponent;
  let fixture: ComponentFixture<ParcelInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelInComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParcelInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
