import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocImplementationComponent } from './loc-implementation.component';

describe('LocImplementationComponent', () => {
  let component: LocImplementationComponent;
  let fixture: ComponentFixture<LocImplementationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocImplementationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocImplementationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
