import { initializeApp } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import analytics from '@react-native-firebase/analytics';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "plant-identifier-mx.firebaseapp.com",
  projectId: "plant-identifier-mx",
  storageBucket: "plant-identifier-mx.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar Firestore
firestore().settings({
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
  ignoreUndefinedProperties: true,
});

// Configurar Analytics
analytics().setAnalyticsCollectionEnabled(true);

// Configurar Auth
auth().setPersistence('local');

export { app, auth, firestore, storage, analytics };

// Tipos de Firebase
export type { FirebaseAuthTypes };

// Colecciones de Firestore
export const COLLECTIONS = {
  USERS: 'users',
  PLANTS: 'plants',
  IDENTIFICATIONS: 'identifications',
  PLANT_COLLECTIONS: 'plantCollections',
  AI_MODELS: 'aiModels',
  OFFLINE_DATA: 'offlineData',
  PLANT_CARE_REMINDERS: 'plantCareReminders',
  COMMUNITY_OBSERVATIONS: 'communityObservations',
  EDUCATIONAL_CONTENT: 'educationalContent'
} as const;

// Configuración de Storage
export const STORAGE_PATHS = {
  PLANT_IMAGES: 'plants',
  USER_IMAGES: 'users',
  IDENTIFICATION_IMAGES: 'identifications',
  MODEL_FILES: 'models'
} as const;

// Configuración de caché
export const CACHE_CONFIG = {
  MAX_PLANTS: 1000,
  MAX_IMAGES: 500,
  MAX_MODEL_SIZE: 100 * 1024 * 1024, // 100MB
  SYNC_INTERVAL: 24 * 60 * 60 * 1000 // 24 horas
} as const;