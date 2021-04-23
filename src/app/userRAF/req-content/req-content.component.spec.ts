import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqContentComponent } from './req-content.component';

describe('ReqContentComponent', () => {
  let component: ReqContentComponent;
  let fixture: ComponentFixture<ReqContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
