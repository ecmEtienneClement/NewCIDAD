import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncriptionComponent } from './incription.component';

describe('IncriptionComponent', () => {
  let component: IncriptionComponent;
  let fixture: ComponentFixture<IncriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
