import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'

import { RemoteCenterComponent } from './remote-center.component';

describe('RemoteCenterComponent', () => {
  let component: RemoteCenterComponent;
  let fixture: ComponentFixture<RemoteCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RemoteCenterComponent],
      imports: [RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoteCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
