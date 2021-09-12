import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistreComponent } from './enregistre.component';

describe('EnregistreComponent', () => {
  let component: EnregistreComponent;
  let fixture: ComponentFixture<EnregistreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnregistreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnregistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
