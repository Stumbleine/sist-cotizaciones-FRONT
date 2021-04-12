import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageRAFComponent } from './home-page-raf.component';

describe('HomePageRAFComponent', () => {
  let component: HomePageRAFComponent;
  let fixture: ComponentFixture<HomePageRAFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePageRAFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageRAFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
