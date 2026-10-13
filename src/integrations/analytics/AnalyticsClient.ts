type AnalyticsEvent =
  | {
      sessionId: string;
      type: 'game_started';
      level: number;
      occurredAt: number;
    }
  | {
      sessionId: string;
      type: 'score_changed';
      level: number;
      score: number;
      occurredAt: number;
    }
  | {
      sessionId: string;
      type: 'progress_changed';
      level: number;
      progress: number;
      occurredAt: number;
    }
  | {
      sessionId: string;
      type: 'game_ended';
      level: number;
      score: number;
      progress: number;
      outcome: 'complete' | 'fail' | 'quit';
      occurredAt: number;
    };

export class AnalyticsClient {
  constructor(private readonly baseUrl: string) {}

  async send(event: AnalyticsEvent): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        console.warn('Analytics event rejected', response.status);
      }
    } catch (error) {
      console.warn('Analytics request failed', error);
    }
  }
}