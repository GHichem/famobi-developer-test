import { Router } from 'express';
import { FieldValue } from 'firebase-admin/firestore';

import { db } from '../firebase.js';
import { analyticsEventSchema } from './analyticsSchema.js';

export const analyticsRouter = Router();

analyticsRouter.post('/events', async (request, response) => {
  const parsedEvent = analyticsEventSchema.safeParse(request.body);

  if (!parsedEvent.success) {
    response.status(400).json({
      error: 'Invalid analytics event',
      details: parsedEvent.error.flatten()
    });

    return;
  }

  const event = parsedEvent.data;

  const document = await db.collection('analyticsEvents').add({
    ...event,
    receivedAt: FieldValue.serverTimestamp()
  });

  response.status(201).json({
    id: document.id
  });
});

analyticsRouter.get('/events', async (_request, response) => {
  const snapshot = await db
    .collection('analyticsEvents')
    .orderBy('receivedAt', 'desc')
    .limit(100)
    .get();

  const events = snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data()
  }));

  response.json({ events });
});