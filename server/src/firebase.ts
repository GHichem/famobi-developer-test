import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseApp = initializeApp({
  projectId: 'demo-famobi-test'
});

export const db = getFirestore(firebaseApp);