import { SceneItemType } from './scene-item-type.enum';

/** Class representing a Scene item */
export class SceneItem {
  public cy: number;
  public cx: number;
  /**
   * The name of this Scene Item
   */
  public name: string;
  /**
   * Scene item ID
   */
  public id: number;
  /**
   * Whether or not this Scene Item is set to "visible".
   */
  public render: boolean;
  /**
   * Whether or not this Scene Item is locked and can't be moved around
   */
  public locked: boolean;
  // tslint:disable-next-line: variable-name
  public source_cx:	number;
  // tslint:disable-next-line: variable-name
  public source_cy:	number;
  /**
   * Source type. Value is one of the following: "input", "filter", "transition", "scene" or "unknown"
   */
  public type: SceneItemType;
  public volume: number;
  public x:	number;
  public y:	number;
  /**
   * Name of the item's parent (if this item belongs to a group)
   */
  public parentGroupName?: string;
  public groupChildren?: SceneItem[];

  // constructor(data: Partial<SceneItem>) {
  //   Object.assign(this, data);
  // }
}
