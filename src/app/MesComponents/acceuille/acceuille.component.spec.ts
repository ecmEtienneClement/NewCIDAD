import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilleComponent } from './acceuille.component';

describe('AcceuilleComponent', () => {
  let component: AcceuilleComponent;
  let fixture: ComponentFixture<AcceuilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceuilleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceuilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
