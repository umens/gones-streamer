import { TestBed } from '@angular/core/testing';

import { ObsWebsocketService } from './obs-websocket.service';

describe('ObsWebsocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObsWebsocketService = TestBed.get(ObsWebsocketService);
    expect(service).toBeTruthy();
  });
});
