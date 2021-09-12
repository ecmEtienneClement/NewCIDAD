import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvantInscriptionComponent } from './avant-inscription.component';

describe('AvantInscriptionComponent', () => {
  let component: AvantInscriptionComponent;
  let fixture: ComponentFixture<AvantInscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvantInscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvantInscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
