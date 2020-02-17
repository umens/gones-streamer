import { GameOptions } from './game-options.model';
import { TeamPossession } from '../enums/team-possession.enum';

describe('GameOptions', () => {
  it('should create an instance', () => {
    expect(new GameOptions({
      quarter: 1,
      possession: TeamPossession.HOME,
      flag: false,
      showScoreboard: true
    })).toBeTruthy();
  });
});
