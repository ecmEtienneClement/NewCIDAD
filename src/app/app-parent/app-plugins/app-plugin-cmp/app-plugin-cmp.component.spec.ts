import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPluginCmpComponent } from './app-plugin-cmp.component';

describe('AppPluginCmpComponent', () => {
  let component: AppPluginCmpComponent;
  let fixture: ComponentFixture<AppPluginCmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppPluginCmpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppPluginCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
