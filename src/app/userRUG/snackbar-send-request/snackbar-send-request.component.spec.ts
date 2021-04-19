import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarSendRequestComponent } from './snackbar-send-request.component';

describe('SnackbarSendRequestComponent', () => {
  let component: SnackbarSendRequestComponent;
  let fixture: ComponentFixture<SnackbarSendRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackbarSendRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarSendRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
