import { TestBed } from '@angular/core/testing';

import { ObsWebsocketService } from './obs-websocket.service';
import { WebsocketService } from '../../shared/services/websocket.service';

describe('ObsWebsocketService', () => {

  // let websocketService: WebsocketService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [WebsocketService]
  }));

  it('should be created', () => {
    const service: ObsWebsocketService = TestBed.get(ObsWebsocketService);
    expect(service).toBeTruthy();
  });
});
