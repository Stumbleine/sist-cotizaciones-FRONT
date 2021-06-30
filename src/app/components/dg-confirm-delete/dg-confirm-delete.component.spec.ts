import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgConfirmDeleteComponent } from './dg-confirm-delete.component';

describe('DgConfirmDeleteComponent', () => {
  let component: DgConfirmDeleteComponent;
  let fixture: ComponentFixture<DgConfirmDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgConfirmDeleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgConfirmDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
