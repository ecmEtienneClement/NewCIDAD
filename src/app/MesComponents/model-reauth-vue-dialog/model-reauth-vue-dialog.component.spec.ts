import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelReauthVueDialogComponent } from './model-reauth-vue-dialog.component';

describe('ModelReauthVueDialogComponent', () => {
  let component: ModelReauthVueDialogComponent;
  let fixture: ComponentFixture<ModelReauthVueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelReauthVueDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelReauthVueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
