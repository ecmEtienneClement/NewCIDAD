import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBDetPourcComponent } from './select-bdet-pourc.component';

describe('SelectBDetPourcComponent', () => {
  let component: SelectBDetPourcComponent;
  let fixture: ComponentFixture<SelectBDetPourcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBDetPourcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBDetPourcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
