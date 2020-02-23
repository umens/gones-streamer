import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerHighlightComponent } from './player-highlight.component';

describe('PlayerHighlightComponent', () => {
  let component: PlayerHighlightComponent;
  let fixture: ComponentFixture<PlayerHighlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
