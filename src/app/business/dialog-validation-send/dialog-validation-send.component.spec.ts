import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogValidationSendComponent } from './dialog-validation-send.component';

describe('DialogValidationSendComponent', () => {
  let component: DialogValidationSendComponent;
  let fixture: ComponentFixture<DialogValidationSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogValidationSendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogValidationSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
