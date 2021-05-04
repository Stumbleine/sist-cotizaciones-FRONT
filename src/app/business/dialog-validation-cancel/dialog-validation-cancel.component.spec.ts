import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogValidationCancelComponent } from './dialog-validation-cancel.component';

describe('DialogValidationCancelComponent', () => {
  let component: DialogValidationCancelComponent;
  let fixture: ComponentFixture<DialogValidationCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogValidationCancelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogValidationCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
