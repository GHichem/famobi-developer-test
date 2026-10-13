export type AnalyticsEvent = {
  id: string;
  sessionId: string;
  type: 'game_started' | 'score_changed' | 'progress_changed' | 'game_ended';
  level: number;
  score?: number;
  progress?: number;
  outcome?: 'complete' | 'fail' | 'quit';
  occurredAt: number;
};

export type AnalyticsResponse = {
  events: AnalyticsEvent[];
};