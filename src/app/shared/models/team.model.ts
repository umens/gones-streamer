interface ITeam {
  name: string;
  city: string;
  score?: number;
  timeout?: number;
  color?: string;
  logo?: string;
}

export class Team {
  /**
   * Name of the team.
   */
  name: string;
  /**
   * Name of the team's city
   */
  city: string;
  /**
   * Score for the team.
   */
  score: number;
  /**
   * Timeout Left.
   */
  timeout: number;
  /**
   * Color of the team
   */
  color: string;
  /**
   * Path for the team's logo
   */
  logo: string;

  /**
   * constructor function
   * @param values Object representing the team
   */
  constructor(values: ITeam) {
    this.score = 0;
    this.timeout = 3;
    this.color = '#ffffff';
    this.logo = null;
    Object.assign(this, values);
  }
}
