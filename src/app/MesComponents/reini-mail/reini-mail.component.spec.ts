import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReiniMailComponent } from './reini-mail.component';

describe('ReiniMailComponent', () => {
  let component: ReiniMailComponent;
  let fixture: ComponentFixture<ReiniMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReiniMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReiniMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
