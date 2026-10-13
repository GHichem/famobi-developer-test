import type { GameController } from '../../application/GameController';

export class FamobiAdapter {
  constructor(
    private readonly controller: GameController,
    private readonly gameInterface: Window['GameInterface']
  ) {}

  connect(): void {
    this.controller.events.on('ready', () => {
      this.gameInterface.gameReady();
    });
  }
}