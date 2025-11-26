import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (!getApps().length) {
    const firebaseConfig = {
      apiKey: 'demo',
      authDomain: 'demo.firebaseapp.com',
      projectId: config.public.firebaseProjectId
    }

    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)

    if (process.client && window.location.hostname === 'localhost') {
      connectFirestoreEmulator(db, '127.0.0.1', 8080)
    }

    return {
      provide: {
        db: () => db
      }
    }
  }

  // fallback, если уже инициализировано
  const app = getApps()[0]
  const db = getFirestore(app)
  return {
    provide: {
      db: () => db
    }
  }
})
