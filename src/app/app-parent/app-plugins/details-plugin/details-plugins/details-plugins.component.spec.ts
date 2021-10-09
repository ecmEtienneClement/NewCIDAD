import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPluginsComponent } from './details-plugins.component';

describe('DetailsPluginsComponent', () => {
  let component: DetailsPluginsComponent;
  let fixture: ComponentFixture<DetailsPluginsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsPluginsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
