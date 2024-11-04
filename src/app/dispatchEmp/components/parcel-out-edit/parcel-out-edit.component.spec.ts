import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelOutEditComponent } from './parcel-out-edit.component';

describe('ParcelOutEditComponent', () => {
  let component: ParcelOutEditComponent;
  let fixture: ComponentFixture<ParcelOutEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelOutEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParcelOutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
