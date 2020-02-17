interface ISponsor {
  name: string;
  logo: string;
}

export class Sponsor {
  /**
   * name of the sponsor
   */
  name: string;
  /**
   * logo of the sponsor
   */
  logo: string;

  /**
   * Creates an instance of Sponsor.
   */
  constructor(values: ISponsor) {
    Object.assign(this, values);
  }
}
