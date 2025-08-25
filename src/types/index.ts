export interface Plant {
  id: string;
  scientificName: string;
  commonNames: string[];
  family: string;
  origin: 'Nativa' | 'Endémica' | 'Exótica';
  description: {
    morphological: string;
    habitat: string;
    distribution: string;
    phenology: {
      flowering: string;
      fruiting: string;
    };
    ecologicalImportance: string;
    uses: {
      medicinal?: string;
      culinary?: string;
      ornamental?: string;
      artisanal?: string;
    };
    conservationStatus: string;
    toxicity?: string;
  };
  care: {
    watering: string;
    light: string;
    soil: string;
    fertilization: string;
    pruning: string;
    pestManagement: string;
  };
  images: {
    leaves?: string[];
    flowers?: string[];
    fruits?: string[];
    fullPlant?: string[];
  };
  region: string[];
  plantType: 'Árbol' | 'Arbusto' | 'Hierba' | 'Cactácea' | 'Orquídea' | 'Otro';
  createdAt: Date;
  updatedAt: Date;
}

export interface Identification {
  id: string;
  userId: string;
  plantId?: string;
  imageUri: string;
  confidence: number;
  predictions: Array<{
    plantId: string;
    confidence: number;
    scientificName: string;
    commonNames: string[];
  >;
  confirmedPlantId?: string;
  isConfirmed: boolean;
  location?: {
    latitude: number;
    longitude: number;
    region: string;
    municipality: string;
  };
  filters: {
    region?: string;
    plantType?: string;
    distribution?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences: {
    region: string;
    language: 'es' | 'en';
    notifications: boolean;
    offlineMode: boolean;
  };
  plantCollection: string[]; // IDs de plantas identificadas
  createdAt: Date;
  updatedAt: Date;
}

export interface PlantCollection {
  id: string;
  userId: string;
  plantId: string;
  plant: Plant;
  addedAt: Date;
  notes?: string;
  personalImages?: string[];
}

export interface AIModel {
  id: string;
  version: string;
  accuracy: number;
  lastUpdated: Date;
  modelSize: number; // en MB
  supportedRegions: string[];
  supportedPlantTypes: string[];
}

export interface OfflineData {
  plants: Plant[];
  modelVersion: string;
  lastSync: Date;
  totalSize: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
  offlineMode: boolean;
  dataUsage: 'low' | 'medium' | 'high';
  notifications: {
    careReminders: boolean;
    newPlants: boolean;
    updates: boolean;
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  region: string;
  municipality: string;
  state: string;
  country: string;
}

export interface FilterOptions {
  region?: string;
  plantType?: string;
  distribution?: string;
  family?: string;
  conservationStatus?: string;
}

export interface SearchResult {
  plants: Plant[];
  total: number;
  hasMore: boolean;
  filters: FilterOptions;
}

export interface CameraCapture {
  uri: string;
  type: 'photo' | 'video';
  width: number;
  height: number;
  timestamp: Date;
  location?: LocationData;
}

export interface PlantCareReminder {
  id: string;
  userId: string;
  plantId: string;
  type: 'watering' | 'fertilization' | 'pruning' | 'repotting';
  frequency: number; // días
  lastPerformed: Date;
  nextDue: Date;
  isActive: boolean;
  notes?: string;
}