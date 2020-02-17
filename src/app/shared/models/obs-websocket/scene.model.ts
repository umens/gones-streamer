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
  /**
   * Display status of the scene
   */
  active: boolean;

  constructor(data: any) {
    this.name = data.name;
    this.sources = data.sources.map(source => {
      return new SceneItem(source);
    });
    this.active = false;
  }
}
