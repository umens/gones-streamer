import { GameStatus, LiveSettings } from ".";

export type StoreType = {
  GameStatus: GameStatus,
  LiveSettings: LiveSettings,
  BackgroundImage: string | null,
};