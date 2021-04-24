import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgCreateCotComponent } from './dg-create-cot.component';

describe('DgCreateCotComponent', () => {
  let component: DgCreateCotComponent;
  let fixture: ComponentFixture<DgCreateCotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgCreateCotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgCreateCotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
