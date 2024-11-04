import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRefSeqComponent } from './add-ref-seq.component';

describe('AddRefSeqComponent', () => {
  let component: AddRefSeqComponent;
  let fixture: ComponentFixture<AddRefSeqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRefSeqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddRefSeqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
