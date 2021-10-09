import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVideoCmpComponent } from './app-video-cmp.component';

describe('AppVideoCmpComponent', () => {
  let component: AppVideoCmpComponent;
  let fixture: ComponentFixture<AppVideoCmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppVideoCmpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppVideoCmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
