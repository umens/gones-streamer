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
}