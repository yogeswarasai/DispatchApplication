import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocAdminComponent } from './loc-admin.component';

describe('LocAdminComponent', () => {
  let component: LocAdminComponent;
  let fixture: ComponentFixture<LocAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
