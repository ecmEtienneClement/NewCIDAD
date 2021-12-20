import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsBdDesactiveLocalComponent } from './details-bd-desactive-local.component';

describe('DetailsBdDesactiveLocalComponent', () => {
  let component: DetailsBdDesactiveLocalComponent;
  let fixture: ComponentFixture<DetailsBdDesactiveLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsBdDesactiveLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsBdDesactiveLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
