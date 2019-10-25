import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStatusCardComponent } from './live-status-card.component';

describe('LiveStatusCardComponent', () => {
  let component: LiveStatusCardComponent;
  let fixture: ComponentFixture<LiveStatusCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveStatusCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
