import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenesCardComponent } from './scenes-card.component';

describe('ScenesCardComponent', () => {
  let component: ScenesCardComponent;
  let fixture: ComponentFixture<ScenesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
