import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DgUploadComponent } from './dg-upload.component';

describe('DgUploadComponent', () => {
  let component: DgUploadComponent;
  let fixture: ComponentFixture<DgUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DgUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DgUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
