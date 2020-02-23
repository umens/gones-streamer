import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerRoomComponent } from './partner-room.component';

describe('PartnerRoomComponent', () => {
  let component: PartnerRoomComponent;
  let fixture: ComponentFixture<PartnerRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
