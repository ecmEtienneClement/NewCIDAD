import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBdActiveLocalComponent } from './details-bd-active-local.component';

describe('DetailsBdActiveLocalComponent', () => {
  let component: DetailsBdActiveLocalComponent;
  let fixture: ComponentFixture<DetailsBdActiveLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsBdActiveLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBdActiveLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
