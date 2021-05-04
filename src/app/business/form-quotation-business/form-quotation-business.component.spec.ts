import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormQuotationBusinessComponent } from './form-quotation-business.component';

describe('FormQuotationBusinessComponent', () => {
  let component: FormQuotationBusinessComponent;
  let fixture: ComponentFixture<FormQuotationBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormQuotationBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormQuotationBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
