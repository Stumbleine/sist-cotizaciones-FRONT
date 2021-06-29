import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterUnidadComponent } from './register-unidad.component';

describe('RegisterUnidadComponent', () => {
  let component: RegisterUnidadComponent;
  let fixture: ComponentFixture<RegisterUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterUnidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
