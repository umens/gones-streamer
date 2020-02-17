import { Sponsor } from './sponsor.model';

describe('Sponsor.Model', () => {
  it('should create an instance', () => {
    expect(new Sponsor({
      name: '',
      logo: ''
    })).toBeTruthy();
  });
});
