import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRequestedComponent } from './dialog-requested.component';

describe('DialogRequestedComponent', () => {
  let component: DialogRequestedComponent;
  let fixture: ComponentFixture<DialogRequestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRequestedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
