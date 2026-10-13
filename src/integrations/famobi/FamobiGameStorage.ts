import type { GameStorage, PlayerProfile } from '../../core/storage/GameStorage';
import type { FamobiGameInterface } from './FamobiGameInterface';

const STORAGE_KEY = 'neon-snake:profile';

const defaultProfile = (): PlayerProfile => ({
  bestScore: 0,
  highestUnlockedLevel: 1,
  totalRuns: 0,
  playerMuted: false
});

export class FamobiGameStorage implements GameStorage {
  constructor(
    private readonly storage: FamobiGameInterface['storage']
  ) {}

  loadProfile(): PlayerProfile {
    try {
      const storedProfile = this.storage.getItem(STORAGE_KEY);

      if (typeof storedProfile !== 'string') {
        return defaultProfile();
      }

      const value = JSON.parse(storedProfile) as Partial<PlayerProfile>;

      return {
        bestScore: this.nonNegativeInteger(value.bestScore, 0),
        highestUnlockedLevel: Math.min(
          3,
          Math.max(
            1,
            this.nonNegativeInteger(value.highestUnlockedLevel, 1)
          )
        ),
        totalRuns: this.nonNegativeInteger(value.totalRuns, 0),
        playerMuted:
          typeof value.playerMuted === 'boolean'
            ? value.playerMuted
            : false
      };
    } catch {
      return defaultProfile();
    }
  }

  saveProfile(profile: PlayerProfile): void {
    try {
      this.storage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
      );
    } catch {
      // Keep the game playable if platform storage is unavailable.
    }
  }

  private nonNegativeInteger(
    value: unknown,
    fallback: number
  ): number {
    return typeof value === 'number' && Number.isFinite(value)
      ? Math.max(0, Math.floor(value))
      : fallback;
  }
}