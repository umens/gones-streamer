import { Player } from './player.model';

describe('Player.Model', () => {
  it('should create an instance', () => {
    expect(new Player({})).toBeTruthy();
  });
});
