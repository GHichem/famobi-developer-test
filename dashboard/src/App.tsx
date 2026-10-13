import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import './App.css';
import { fetchAnalyticsEvents } from './api';
import type { AnalyticsEvent } from './types';

function App() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsEvents()
      .then(({ events }) => setEvents(events))
      .catch((error: unknown) => {
        setError(error instanceof Error ? error.message : 'Unknown error');
      });
  }, []);

  const summary = useMemo(() => {
    const endedEvents = events.filter(
      (event) => event.type === 'game_ended'
    );

    const uniqueSessions = new Set(
      events.map((event) => event.sessionId)
    ).size;

    const completed = endedEvents.filter(
      (event) => event.outcome === 'complete'
    ).length;

    const failed = endedEvents.filter(
      (event) => event.outcome === 'fail'
    ).length;

    const quit = endedEvents.filter(
      (event) => event.outcome === 'quit'
    ).length;

    const scores = endedEvents
      .map((event) => event.score)
      .filter((score): score is number => typeof score === 'number');

    const averageScore =
      scores.length === 0
        ? 0
        : scores.reduce((sum, score) => sum + score, 0) /
          scores.length;

    return {
      uniqueSessions,
      completed,
      failed,
      quit,
      averageScore
    };
  }, [events]);

  const outcomesByLevel = useMemo(() => {
    return [1, 2, 3].map((level) => {
      const levelEvents = events.filter(
        (event) =>
          event.type === 'game_ended' &&
          event.level === level
      );

      return {
        level: `Level ${level}`,
        complete: levelEvents.filter(
          (event) => event.outcome === 'complete'
        ).length,
        fail: levelEvents.filter(
          (event) => event.outcome === 'fail'
        ).length,
        quit: levelEvents.filter(
          (event) => event.outcome === 'quit'
        ).length
      };
    });
  }, [events]);

  const averageProgressByLevel = useMemo(() => {
    return [1, 2, 3].map((level) => {
      const progressEvents = events.filter(
        (event) =>
          event.type === 'progress_changed' &&
          event.level === level &&
          typeof event.progress === 'number'
      );

      const average =
        progressEvents.length === 0
          ? 0
          : progressEvents.reduce(
              (sum, event) => sum + (event.progress ?? 0),
              0
            ) / progressEvents.length;

      return {
        level: `Level ${level}`,
        averageProgress: Math.round(average * 100)
      };
    });
  }, [events]);

  if (error) {
    return (
      <main className="dashboard">
        <h1>Neon Snake Analytics</h1>
        <p>Could not load analytics: {error}</p>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header>
        <p className="eyebrow">Famobi Developer Test</p>

        <h1>Neon Snake Analytics</h1>

        <p className="subtitle">
          Local gameplay insights from the Firestore emulator
        </p>
      </header>

      <section className="summary-grid">
        <article className="summary-card">
          <span>Sessions</span>
          <strong>{summary.uniqueSessions}</strong>
        </article>

        <article className="summary-card">
          <span>Completed</span>
          <strong>{summary.completed}</strong>
        </article>

        <article className="summary-card">
          <span>Failed</span>
          <strong>{summary.failed}</strong>
        </article>

        <article className="summary-card">
          <span>Quit</span>
          <strong>{summary.quit}</strong>
        </article>

        <article className="summary-card">
          <span>Average final score</span>
          <strong>{summary.averageScore.toFixed(1)}</strong>
        </article>
      </section>

      <section className="chart-grid">
        <article className="chart-card">
          <h2>Outcomes by level</h2>

          <p>
            Shows where players complete, fail, or leave gameplay.
          </p>

          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomesByLevel}>
                <CartesianGrid
                  stroke="#334155"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="level"
                  stroke="#94a3b8"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#94a3b8"
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="complete"
                  name="Completed"
                  fill="#84cc16"
                />

                <Bar
                  dataKey="fail"
                  name="Failed"
                  fill="#ef4444"
                />

                <Bar
                  dataKey="quit"
                  name="Quit"
                  fill="#f59e0b"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card">
          <h2>Average progress by level</h2>

          <p>
            Shows how far players typically progress in each level.
          </p>

          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={averageProgressByLevel}>
                <CartesianGrid
                  stroke="#334155"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="level"
                  stroke="#94a3b8"
                />

                <YAxis
                  domain={[0, 100]}
                  unit="%"
                  stroke="#94a3b8"
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="averageProgress"
                  name="Average progress"
                  stroke="#38bdf8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;