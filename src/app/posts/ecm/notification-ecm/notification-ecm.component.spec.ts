import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationEcmComponent } from './notification-ecm.component';

describe('NotificationEcmComponent', () => {
  let component: NotificationEcmComponent;
  let fixture: ComponentFixture<NotificationEcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationEcmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationEcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
