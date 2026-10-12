import { z } from 'zod';

const baseEventSchema = z.object({
  sessionId: z.string().min(1).max(100),
  level: z.number().int().min(1).max(3),
  occurredAt: z.number().int().positive()
});

const gameStartedSchema = baseEventSchema.extend({
  type: z.literal('game_started')
});

const scoreChangedSchema = baseEventSchema.extend({
  type: z.literal('score_changed'),
  score: z.number().int().nonnegative()
});

const progressChangedSchema = baseEventSchema.extend({
  type: z.literal('progress_changed'),
  progress: z.number().min(0).max(1)
});

const gameEndedSchema = baseEventSchema.extend({
  type: z.literal('game_ended'),
  score: z.number().int().nonnegative(),
  progress: z.number().min(0).max(1),
  outcome: z.enum(['complete', 'fail', 'quit'])
});

export const analyticsEventSchema = z.discriminatedUnion('type', [
  gameStartedSchema,
  scoreChangedSchema,
  progressChangedSchema,
  gameEndedSchema
]);

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;