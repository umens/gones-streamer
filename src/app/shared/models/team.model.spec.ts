import { Team } from './team.model';

describe('Team', () => {
  it('should create an instance', () => {
    expect(new Team({
      name: '',
      city: ''
    })).toBeTruthy();
  });
});
