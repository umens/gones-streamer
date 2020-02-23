import { TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [WebsocketService] }));

  it('should be created', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    expect(service).toBeTruthy();
  });
  // it('should use ValueService', () => {
  //   const service: WebsocketService = TestBed.get(WebsocketService);
  //   expect(service.getValue()).toBe('real value');
  // });
});
