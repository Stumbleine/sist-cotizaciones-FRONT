import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationContentComponent } from './quotation-content.component';

describe('QuotationContentComponent', () => {
  let component: QuotationContentComponent;
  let fixture: ComponentFixture<QuotationContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
