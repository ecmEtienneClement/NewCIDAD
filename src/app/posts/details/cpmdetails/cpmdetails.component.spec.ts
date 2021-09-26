import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpmdetailsComponent } from './cpmdetails.component';

describe('CpmdetailsComponent', () => {
  let component: CpmdetailsComponent;
  let fixture: ComponentFixture<CpmdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpmdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpmdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
