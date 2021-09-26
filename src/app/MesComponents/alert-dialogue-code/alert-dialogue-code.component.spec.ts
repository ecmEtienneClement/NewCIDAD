import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogueCodeComponent } from './alert-dialogue-code.component';

describe('AlertDialogueCodeComponent', () => {
  let component: AlertDialogueCodeComponent;
  let fixture: ComponentFixture<AlertDialogueCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertDialogueCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogueCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
