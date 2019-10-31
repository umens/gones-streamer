import { BoundsType } from './bounds-type.enum';

export class SceneItemTransform {
  position: {
    /**
     * The x position of the scene item from the left.
     */
    x: number;
    /**
     * The y position of the scene item from the top.
     */
    y: number;
    /**
     * The point on the scene item that the item is manipulated from.
     */
    alignment: number;
  };
  /**
   * The clockwise rotation of the scene item in degrees around the point of alignment.
   */
  rotation: number;
  scale: {
    /**
     * The x-scale factor of the scene item.
     */
    x: number;
    /**
     * The y-scale factor of the scene item.
     */
    y: number;
  };
  crop: {
    /**
     * The number of pixels cropped off the top of the scene item before scaling.
     */
    top: number;
    /**
     * The number of pixels cropped off the right of the scene item before scaling.
     */
    right: number;
    /**
     * The number of pixels cropped off the bottom of the scene item before scaling.
     */
    bottom: number;
    /**
     * The number of pixels cropped off the left of the scene item before scaling.
     */
    left: number;
  };
  /**
   * If the scene item is visible.
   */
  visible: boolean;
  /**
   * If the scene item is locked in position.
   */
  locked: boolean;
  bounds: {
    /**
     * Type of bounding box.
     * Can be "OBS_BOUNDS_STRETCH", "OBS_BOUNDS_SCALE_INNER", "OBS_BOUNDS_SCALE_OUTER",
     * "OBS_BOUNDS_SCALE_TO_WIDTH", "OBS_BOUNDS_SCALE_TO_HEIGHT", "OBS_BOUNDS_MAX_ONLY" or "OBS_BOUNDS_NONE".
     */
    type: BoundsType;
    /**
     * Alignment of the bounding box.
     */
    alignment: number;
    /**
     * Width of the bounding box.
     */
    x: number;
    /**
     * Height of the bounding box.
     */
    y: number;
  };
  /**
   * Base width (without scaling) of the source
   */
  sourceWidth: number;
  /**
   * Base height (without scaling) of the source
   */
  sourceHeight: number;
  /**
   * Scene item width (base source width multiplied by the horizontal scaling factor)
   */
  width: number;
  /**
   * Scene item height (base source height multiplied by the vertical scaling factor)
   */
  height: number;
  /**
   * Name of the item's parent (if this item belongs to a group)
   */
  parentGroupName?: string;
  /**
   * 	List of children (if this item is a group)
   */
  groupChildren?: SceneItemTransform[];
}
