export interface Plant {
  id: string;
  scientificName: string;
  commonNames: string[];
  family: string;
  origin: 'Nativa' | 'Endémica' | 'Exótica';
  description: string;
  habitat: string;
  distribution: string[];
  phenology: {
    flowering: string;
    fruiting: string;
  };
  ecologicalImportance: string;
  uses: {
    medicinal: boolean;
    culinary: boolean;
    ornamental: boolean;
    artisanal: boolean;
  };
  conservationStatus: string;
  care: {
    watering: string;
    light: string;
    soil: string;
    fertilization: string;
    pruning: string;
    pestManagement: string;
  };
  warnings: string[];
  images: string[];
  category: 'Árbol' | 'Arbusto' | 'Flor' | 'Cactácea' | 'Orquídea' | 'Hierba' | 'Otro';
  toxicity: boolean;
  toxicityLevel?: 'Baja' | 'Media' | 'Alta';
}

export interface PlantIdentification {
  id: string;
  plantId: string;
  imageUri: string;
  confidence: number;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
    region: string;
    municipality: string;
  };
  filters: {
    region: string;
    plantType: string;
    distribution: string;
  };
  confirmed: boolean;
}

export interface PlantHistory {
  id: string;
  plantId: string;
  plant: Plant;
  identification: PlantIdentification;
  unlockedAt: Date;
  isFavorite: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredCount: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
}