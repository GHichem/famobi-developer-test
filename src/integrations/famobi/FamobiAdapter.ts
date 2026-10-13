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

  this.controller.events.on('runEnded', ({ reason }) => {
  void this.endGame(reason);
});

this.controller.events.on('gameFinished', () => {
  void this.finishGame();
});

this.gameInterface.onPauseStateChange((paused) => {
  this.controller.setSystemPaused(paused);
});

this.gameInterface.onMuteStateChange((muted) => {
  this.controller.setSystemMuted(muted);
});

this.controller.setSystemMuted(this.gameInterface.isMuted());
this.controller.setSystemPaused(this.gameInterface.isPaused());
}

async startGame(level: number): Promise<void> {
  await this.gameInterface.gameStart(level);
}

async pauseGame(): Promise<void> {
  await this.gameInterface.gamePause();
}

async resumeGame(): Promise<void> {
  await this.gameInterface.gameResume();
}

async endGame(reason: 'complete' | 'fail' | 'quit'): Promise<void> {
  await this.gameInterface.gameEnd(reason);
}

async finishGame(): Promise<void> {
  await this.gameInterface.gameFinished();
}

}