import type { GameController } from '../../application/GameController';
import { AnalyticsClient } from './AnalyticsClient';

export class GameAnalyticsAdapter {
  private readonly sessionId = crypto.randomUUID();

  constructor(
    private readonly controller: GameController,
    private readonly client: AnalyticsClient
  ) {}

  connect(): void {
    this.controller.events.on('runStarted', ({ level, occurredAt }) => {
      void this.client.send({
        sessionId: this.sessionId,
        type: 'game_started',
        level,
        occurredAt
      });
    });

    this.controller.events.on('scoreChanged', ({ level, score }) => {
      void this.client.send({
        sessionId: this.sessionId,
        type: 'score_changed',
        level,
        score,
        occurredAt: Date.now()
      });
    });

    this.controller.events.on('progressChanged', ({ level, progress }) => {
      void this.client.send({
        sessionId: this.sessionId,
        type: 'progress_changed',
        level,
        progress,
        occurredAt: Date.now()
      });
    });

    this.controller.events.on(
      'runEnded',
      ({ level, score, progress, reason, occurredAt }) => {
        void this.client.send({
          sessionId: this.sessionId,
          type: 'game_ended',
          level,
          score,
          progress,
          outcome: reason,
          occurredAt
        });
      }
    );
  }
}