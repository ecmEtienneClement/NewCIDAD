import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReponseBugComponent } from './view-reponse-bug.component';

describe('ViewReponseBugComponent', () => {
  let component: ViewReponseBugComponent;
  let fixture: ComponentFixture<ViewReponseBugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReponseBugComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReponseBugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
