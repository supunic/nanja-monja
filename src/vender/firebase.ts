import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

export class MyFirebase {
  private config: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  app: FirebaseApp;
  db: Firestore;

  constructor() {
    this.config = {
      apiKey: process.env.FIREBASE_API_KEY || ``,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || ``,
      projectId: process.env.FIREBASE_PROJECT_ID || ``,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || ``,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || ``,
      appId: process.env.FIREBASE_APP_ID || ``,
    };
    this.app = initializeApp(this.config);
    this.db = getFirestore(this.app);
  }
}
