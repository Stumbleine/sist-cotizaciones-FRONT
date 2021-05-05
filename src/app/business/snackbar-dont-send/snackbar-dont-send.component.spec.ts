import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarDontSendComponent } from './snackbar-dont-send.component';

describe('SnackbarDontSendComponent', () => {
  let component: SnackbarDontSendComponent;
  let fixture: ComponentFixture<SnackbarDontSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackbarDontSendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarDontSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
