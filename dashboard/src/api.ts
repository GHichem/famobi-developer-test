import type { AnalyticsResponse } from './types';

const API_URL = 'http://localhost:3001';

export async function fetchAnalyticsEvents(): Promise<AnalyticsResponse> {
  const response = await fetch(`${API_URL}/api/analytics/events`);

  if (!response.ok) {
    throw new Error(`Analytics request failed: ${response.status}`);
  }

  return response.json() as Promise<AnalyticsResponse>;
}