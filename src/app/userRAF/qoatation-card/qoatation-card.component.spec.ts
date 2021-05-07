import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QoatationCardComponent } from './qoatation-card.component';

describe('QoatationCardComponent', () => {
  let component: QoatationCardComponent;
  let fixture: ComponentFixture<QoatationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QoatationCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QoatationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
