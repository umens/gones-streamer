import { PathsType } from "../Models";

export class Utilities {

  private static instance: Utilities;
  private paths: PathsType;
  private constructor(paths: PathsType) {
    this.paths = paths;
  }

  static getInstance(paths: PathsType): Utilities {
    if (!Utilities.instance) {
      Utilities.instance = new Utilities(paths);
    }

    return Utilities.instance;
  }

  static capitalize = (str: string): string =>{
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  getImageFullPath = (path: string): string => {
    return path.replace('../../../../appDatas', this.paths.appFolder);
  };  
}