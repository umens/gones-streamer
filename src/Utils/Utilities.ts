import { FileUp, PathsType } from "../Models";

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

  getBase64 = (img: FileUp): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result! as string);
      };
  
      reader.onerror = reject;
  
      reader.readAsDataURL(img.file);
    });
  }

  getBase64FromFilePath = async (path: string): Promise<string> => {
    const fullpath = window.app.getFileFromPath(this.getImageFullPath(path));
    return await this.getBase64(fullpath);
  }

  pickTextColorBasedOnBgColorAdvanced = (bgColor: string = '#FFFFFF', lightColor: string, darkColor: string): string => {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    var uicolors = [r / 255, g / 255, b / 255];
    var c = uicolors.map((col) => {
      if (col <= 0.03928) {
        return col / 12.92;
      }
      return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    var L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
    return (L > 0.179) ? darkColor : lightColor;
  };
}