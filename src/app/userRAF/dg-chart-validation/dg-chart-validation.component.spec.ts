import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgChartValidationComponent } from './dg-chart-validation.component';

describe('DgChartValidationComponent', () => {
  let component: DgChartValidationComponent;
  let fixture: ComponentFixture<DgChartValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgChartValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgChartValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
