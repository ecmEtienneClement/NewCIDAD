import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcmComponent } from './ecm.component';

describe('EcmComponent', () => {
  let component: EcmComponent;
  let fixture: ComponentFixture<EcmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
