import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelVueDialogComponent } from './model-vue-dialog.component';

describe('ModelVueDialogComponent', () => {
  let component: ModelVueDialogComponent;
  let fixture: ComponentFixture<ModelVueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelVueDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelVueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
