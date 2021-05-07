import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativeChartComponent } from './comparative-chart.component';

describe('ComparativeChartComponent', () => {
  let component: ComparativeChartComponent;
  let fixture: ComponentFixture<ComparativeChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparativeChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparativeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
