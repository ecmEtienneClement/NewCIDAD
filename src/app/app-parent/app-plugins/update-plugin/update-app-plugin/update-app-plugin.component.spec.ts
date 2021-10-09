import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAppPluginComponent } from './update-app-plugin.component';

describe('UpdateAppPluginComponent', () => {
  let component: UpdateAppPluginComponent;
  let fixture: ComponentFixture<UpdateAppPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAppPluginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAppPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
