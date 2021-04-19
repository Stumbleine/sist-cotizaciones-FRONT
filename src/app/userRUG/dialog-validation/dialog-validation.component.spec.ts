import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogValidationComponent } from './dialog-validation.component';

describe('DialogValidationComponent', () => {
  let component: DialogValidationComponent;
  let fixture: ComponentFixture<DialogValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
