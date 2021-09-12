import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierBugComponent } from './modifier-bug.component';

describe('ModifierBugComponent', () => {
  let component: ModifierBugComponent;
  let fixture: ComponentFixture<ModifierBugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierBugComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierBugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
