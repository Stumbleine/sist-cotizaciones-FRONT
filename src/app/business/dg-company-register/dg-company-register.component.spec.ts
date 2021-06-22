import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgCompanyRegisterComponent } from './dg-company-register.component';

describe('DgCompanyRegisterComponent', () => {
  let component: DgCompanyRegisterComponent;
  let fixture: ComponentFixture<DgCompanyRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgCompanyRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgCompanyRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
