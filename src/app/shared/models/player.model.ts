interface IPlayer {
  lastname: string;
  firstname: string;
  num: number;
  position: string;
  age: number;
  height: number;
  weight: number;
  photo: string;
}

export class Player {
  /**
   * lastname of the player
   */
  lastname: string;
  /**
   * firstname of the player
   */
  firstname: string;
  /**
   * num of the player
   */
  num: number;
  /**
   * position of the player
   */
  position: string;
  /**
   * age of the player
   */
  age: number;
  /**
   * height of the player
   */
  height: number;
  /**
   * weight of the player
   */
  weight: number;
  /**
   * photo of the player (localfile)
   */
  photo: string;

  /**
   * fullname of the player
   */
  get fullname(): string {
    return this.firstname + ' ' + this.lastname;
  }

  /**
   * Creates an instance of Player.
   */
  constructor(values: Partial<IPlayer>) {
    Object.assign(this, values);
  }
}
