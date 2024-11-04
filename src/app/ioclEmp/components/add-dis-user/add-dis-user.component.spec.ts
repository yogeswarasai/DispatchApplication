import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDisUserComponent } from './add-dis-user.component';

describe('AddDisUserComponent', () => {
  let component: AddDisUserComponent;
  let fixture: ComponentFixture<AddDisUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDisUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDisUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
