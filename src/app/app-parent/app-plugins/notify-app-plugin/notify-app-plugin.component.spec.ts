import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyAppPluginComponent } from './notify-app-plugin.component';

describe('NotifyAppPluginComponent', () => {
  let component: NotifyAppPluginComponent;
  let fixture: ComponentFixture<NotifyAppPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifyAppPluginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyAppPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
