import type { FamobiGameInterface } from './FamobiGameInterface';

declare global {
  interface Window {
    GameInterface: FamobiGameInterface;
  }
}

export {};