import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmpecmComponent } from './cmpecm.component';

describe('CmpecmComponent', () => {
  let component: CmpecmComponent;
  let fixture: ComponentFixture<CmpecmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmpecmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmpecmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
