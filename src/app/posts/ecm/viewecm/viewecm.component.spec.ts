import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewecmComponent } from './viewecm.component';

describe('ViewecmComponent', () => {
  let component: ViewecmComponent;
  let fixture: ComponentFixture<ViewecmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewecmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewecmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
