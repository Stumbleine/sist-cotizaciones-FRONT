import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumCardRafComponent } from './sum-card-raf.component';

describe('SumCardRafComponent', () => {
  let component: SumCardRafComponent;
  let fixture: ComponentFixture<SumCardRafComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SumCardRafComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SumCardRafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
