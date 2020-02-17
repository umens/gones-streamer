import { LiveSettings } from './live-settings.model';

describe('LiveSettings.Model', () => {
  it('should create an instance', () => {
    expect(new LiveSettings({
      bitrate: 6000,
      buffer: 15,
      streamKey: ''
    })).toBeTruthy();
  });
});
