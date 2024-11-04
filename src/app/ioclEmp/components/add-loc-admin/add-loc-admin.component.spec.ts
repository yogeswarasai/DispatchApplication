import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLocAdminComponent } from './add-loc-admin.component';

describe('AddLocAdminComponent', () => {
  let component: AddLocAdminComponent;
  let fixture: ComponentFixture<AddLocAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLocAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLocAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
