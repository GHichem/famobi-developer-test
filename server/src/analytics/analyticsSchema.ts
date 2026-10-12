import { z } from 'zod';

export const analyticsEventSchema = z.object({
  sessionId: z.string().min(1).max(100),

  type: z.enum([
    'game_started',
    'score_changed',
    'progress_changed',
    'game_ended'
  ]),

  level: z.number().int().min(1).max(3),

  score: z.number().int().nonnegative().optional(),

  progress: z.number().min(0).max(1).optional(),

  outcome: z.enum(['complete', 'fail', 'quit']).optional(),

  occurredAt: z.number().int().positive()
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;