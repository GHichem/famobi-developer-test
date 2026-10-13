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

  this.controller.events.on('scoreChanged', ({ level, score }) => {
    this.gameInterface.sendScore(score, {
      type: 'live',
      level
    });
  });

  this.controller.events.on('progressChanged', ({ progress }) => {
    this.gameInterface.sendProgress(progress);
  });
}
}