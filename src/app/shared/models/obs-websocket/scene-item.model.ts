import { SceneItemType } from './scene-item-type.enum';

/** Class representing a Scene item */
export class SceneItem {
  cy: number;
  cx: number;
  /**
   * The name of this Scene Item
   */
  name: string;
  /**
   * Scene item ID
   */
  id: number;
  /**
   * Whether or not this Scene Item is set to "visible".
   */
  render: boolean;
  /**
   * Whether or not this Scene Item is locked and can't be moved around
   */
  locked: boolean;
  // tslint:disable-next-line: variable-name
  source_cx:	number;
  // tslint:disable-next-line: variable-name
  source_cy:	number;
  /**
   * Source type. Value is one of the following: "input", "filter", "transition", "scene" or "unknown"
   */
  type: SceneItemType;
  volume: number;
  x:	number;
  y:	number;
  /**
   * Name of the item's parent (if this item belongs to a group)
   */
  parentGroupName?: string;
  groupChildren?: SceneItem[];

  // constructor(data: Partial<SceneItem>) {
  //   Object.assign(this, data);
  // }
  constructor(data: any) {
    Object.assign(this, data);
  }
}
