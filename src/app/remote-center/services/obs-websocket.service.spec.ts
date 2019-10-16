import { TestBed } from '@angular/core/testing';

import { ObsWebsocketService } from './obs-websocket.service';
import { WebsocketService } from 'src/app/shared/services/websocket.service';

describe('ObsWebsocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [WebsocketService]
  }));

  it('should be created', () => {
    const service: ObsWebsocketService = TestBed.get(ObsWebsocketService);
    expect(service).toBeTruthy();
  });
});
