export type FamobiGameEndReason = 'complete' | 'fail' | 'quit';

export interface FamobiGameInterface {
    
  init(load: Array<string | (() => void | Promise<unknown>)>): Promise<void>;

  gameReady(): void;

  gameStart(level?: number): Promise<void>;

  gamePause(): Promise<void>;

  gameResume(): Promise<void>;

  gameEnd(reason: FamobiGameEndReason): Promise<void>;

  gameFinished(): Promise<void>;

  sendScore(
    score: number,
    params?: {
      type?: 'live' | 'total' | 'level' | 'stage';
      level?: number;
      stage?: number;
    }
  ): void;

  sendProgress(progress: number): void;

  gameMuted(isMuted?: boolean): void;

  isMuted(): boolean;

  onPauseStateChange(handler: (paused: boolean) => void): void;

  onMuteStateChange(handler: (muted: boolean) => void): void;

  storage: {
    getItem(key: string): unknown;
    setItem(key: string, value: unknown): void;
    removeItem(key: string): void;
    clear(): void;
  };
}