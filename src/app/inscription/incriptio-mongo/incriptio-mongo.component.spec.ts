import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncriptioMongoComponent } from './incriptio-mongo.component';

describe('IncriptioMongoComponent', () => {
  let component: IncriptioMongoComponent;
  let fixture: ComponentFixture<IncriptioMongoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncriptioMongoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncriptioMongoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
