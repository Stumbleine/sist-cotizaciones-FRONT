import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGComponent } from './dialog-g.component';

describe('DialogGComponent', () => {
  let component: DialogGComponent;
  let fixture: ComponentFixture<DialogGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
