import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisUserEditComponent } from './dis-user-edit.component';

describe('DisUserEditComponent', () => {
  let component: DisUserEditComponent;
  let fixture: ComponentFixture<DisUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisUserEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
