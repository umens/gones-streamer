import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InPlaceEditComponent } from './in-place-edit.component';

describe('InPlaceEditComponent', () => {
  let component: InPlaceEditComponent;
  let fixture: ComponentFixture<InPlaceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InPlaceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InPlaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
