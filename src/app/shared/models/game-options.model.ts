import { TeamPossession } from '../enums/team-possession.enum';

interface IGameOptions {
  quarter: number;
  possession: TeamPossession;
  flag: boolean;
  showScoreboard: boolean;
}

export class GameOptions {
  /**
   * Current Quarter
   */
  quarter: number;
  /**
   * Team with current possession
   */
  possession: TeamPossession;
  /**
   * flag visible
   */
  flag: boolean;
  /**
   * Scoreboard visible.
   */
  showScoreboard: boolean;

  /**
   * constructor function
   * @param values Object representing the team
   */
  constructor(values: IGameOptions) {
    this.quarter = 1;
    this.possession = TeamPossession.HOME;
    this.flag = false;
    this.showScoreboard = true;
    Object.assign(this, values);
  }
}
