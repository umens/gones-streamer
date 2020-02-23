import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesMetricsCardComponent } from './frames-metrics-card.component';

describe('FramesMetricsCardComponent', () => {
  let component: FramesMetricsCardComponent;
  let fixture: ComponentFixture<FramesMetricsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramesMetricsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramesMetricsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
