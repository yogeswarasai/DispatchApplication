import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierContractEditComponent } from './courier-contract-edit.component';

describe('CourierContractEditComponent', () => {
  let component: CourierContractEditComponent;
  let fixture: ComponentFixture<CourierContractEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierContractEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CourierContractEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
