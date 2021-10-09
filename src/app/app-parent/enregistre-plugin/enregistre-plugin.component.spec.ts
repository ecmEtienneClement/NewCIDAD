import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistrePluginComponent } from './enregistre-plugin.component';

describe('EnregistrePluginComponent', () => {
  let component: EnregistrePluginComponent;
  let fixture: ComponentFixture<EnregistrePluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnregistrePluginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnregistrePluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
