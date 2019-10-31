import { SceneItem } from './scene-item.model';

export class Scene {
  /**
   * Name of the currently active scene.
   */
  name: string;
  /**
   * Ordered list of the current scene's source items.
   */
  sources: SceneItem[];
}
