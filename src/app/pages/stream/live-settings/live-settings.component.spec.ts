import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveSettingsComponent } from './live-settings.component';

describe('LiveSettingsComponent', () => {
  let component: LiveSettingsComponent;
  let fixture: ComponentFixture<LiveSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
