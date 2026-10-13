import { useEffect, useState } from 'react';

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

  return (
    <main>
      <h1>Neon Snake Analytics</h1>

      {error ? (
        <p>Could not load analytics: {error}</p>
      ) : (
        <p>Loaded events: {events.length}</p>
      )}
    </main>
  );
}

export default App;