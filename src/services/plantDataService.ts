import { Plant, SearchResult, FilterOptions } from '../types';
import { plantDatabase } from '../database/sqlite';
import { firestore, COLLECTIONS } from '../config/firebase';

export class PlantDataService {
  private static instance: PlantDataService;
  private plantsCache: Map<string, Plant> = new Map();
  private searchCache: Map<string, SearchResult> = new Map();

  private constructor() {}

  static getInstance(): PlantDataService {
    if (!PlantDataService.instance) {
      PlantDataService.instance = new PlantDataService();
    }
    return PlantDataService.instance;
  }

  // Obtener planta por ID
  async getPlantById(id: string): Promise<Plant | null> {
    try {
      // Verificar caché local
      if (this.plantsCache.has(id)) {
        return this.plantsCache.get(id)!;
      }

      // Buscar en base de datos local
      let plant = await plantDatabase.getPlant(id);
      
      if (!plant) {
        // Buscar en Firebase
        try {
          const doc = await firestore()
            .collection(COLLECTIONS.PLANTS)
            .doc(id)
            .get();

          if (doc.exists) {
            plant = doc.data() as Plant;
            // Guardar en base de datos local
            await plantDatabase.insertPlant(plant);
          }
        } catch (error) {
          console.warn('No se pudo obtener planta desde Firebase:', error);
        }
      }

      if (plant) {
        this.plantsCache.set(id, plant);
      }

      return plant;
    } catch (error) {
      console.error('Error al obtener planta:', error);
      return null;
    }
  }

  // Buscar plantas con filtros
  async searchPlants(
    filters: FilterOptions = {},
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResult> {
    try {
      const cacheKey = JSON.stringify({ filters, page, limit });
      
      // Verificar caché de búsqueda
      if (this.searchCache.has(cacheKey)) {
        return this.searchCache.get(cacheKey)!;
      }

      // Buscar en base de datos local primero
      let plants = await plantDatabase.searchPlants(filters);
      
      // Si no hay suficientes resultados locales, buscar en Firebase
      if (plants.length < limit) {
        try {
          let query = firestore().collection(COLLECTIONS.PLANTS);
          
          // Aplicar filtros
          if (filters.region) {
            query = query.where('region', 'array-contains', filters.region);
          }
          if (filters.plantType) {
            query = query.where('plantType', '==', filters.plantType);
          }
          if (filters.family) {
            query = query.where('family', '==', filters.family);
          }
          if (filters.distribution) {
            query = query.where('origin', '==', filters.distribution);
          }
          if (filters.conservationStatus) {
            query = query.where('description.conservationStatus', '==', filters.conservationStatus);
          }

          // Aplicar paginación
          query = query.orderBy('scientificName').limit(limit);

          const snapshot = await query.get();
          const firebasePlants: Plant[] = [];
          
          snapshot.forEach(doc => {
            const plant = doc.data() as Plant;
            firebasePlants.push(plant);
            // Guardar en base de datos local
            plantDatabase.insertPlant(plant);
          });

          // Combinar resultados locales y de Firebase
          plants = [...plants, ...firebasePlants];
          
          // Eliminar duplicados
          const uniquePlants = plants.filter((plant, index, self) => 
            index === self.findIndex(p => p.id === plant.id)
          );
          
          plants = uniquePlants;
        } catch (error) {
          console.warn('No se pudo buscar en Firebase:', error);
        }
      }

      // Aplicar paginación
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedPlants = plants.slice(startIndex, endIndex);

      const result: SearchResult = {
        plants: paginatedPlants,
        total: plants.length,
        hasMore: endIndex < plants.length,
        filters
      };

      // Guardar en caché
      this.searchCache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Error en búsqueda de plantas:', error);
      return {
        plants: [],
        total: 0,
        hasMore: false,
        filters
      };
    }
  }

  // Obtener plantas por categoría
  async getPlantsByCategory(category: string, limit: number = 50): Promise<Plant[]> {
    try {
      const filters: FilterOptions = { plantType: category as any };
      const result = await this.searchPlants(filters, 1, limit);
      return result.plants;
    } catch (error) {
      console.error('Error al obtener plantas por categoría:', error);
      return [];
    }
  }

  // Obtener plantas por región
  async getPlantsByRegion(region: string, limit: number = 50): Promise<Plant[]> {
    try {
      const filters: FilterOptions = { region };
      const result = await this.searchPlants(filters, 1, limit);
      return result.plants;
    } catch (error) {
      console.error('Error al obtener plantas por región:', error);
      return [];
    }
  }

  // Obtener plantas endémicas
  async getEndemicPlants(limit: number = 50): Promise<Plant[]> {
    try {
      const filters: FilterOptions = { distribution: 'Endémica' };
      const result = await this.searchPlants(filters, 1, limit);
      return result.plants;
    } catch (error) {
      console.error('Error al obtener plantas endémicas:', error);
      return [];
    }
  }

  // Obtener plantas nativas
  async getNativePlants(limit: number = 50): Promise<Plant[]> {
    try {
      const filters: FilterOptions = { distribution: 'Nativa' };
      const result = await this.searchPlants(filters, 1, limit);
      return result.plants;
    } catch (error) {
      console.error('Error al obtener plantas nativas:', error);
      return [];
    }
  }

  // Obtener familias botánicas disponibles
  async getAvailableFamilies(): Promise<string[]> {
    try {
      // Implementar lógica para obtener familias únicas
      // Por ahora retornamos algunas familias comunes de México
      return [
        'Asteraceae',
        'Fabaceae',
        'Poaceae',
        'Cactaceae',
        'Orchidaceae',
        'Lamiaceae',
        'Rosaceae',
        'Solanaceae',
        'Euphorbiaceae',
        'Malvaceae'
      ];
    } catch (error) {
      console.error('Error al obtener familias disponibles:', error);
      return [];
    }
  }

  // Obtener tipos de plantas disponibles
  async getAvailablePlantTypes(): Promise<string[]> {
    try {
      return [
        'Árbol',
        'Arbusto',
        'Hierba',
        'Cactácea',
        'Orquídea',
        'Otro'
      ];
    } catch (error) {
      console.error('Error al obtener tipos de plantas disponibles:', error);
      return [];
    }
  }

  // Obtener regiones disponibles
  async getAvailableRegions(): Promise<string[]> {
    try {
      // Regiones principales de México
      return [
        'Norte',
        'Centro',
        'Sur',
        'Pacífico',
        'Golfo',
        'Península de Yucatán',
        'Baja California',
        'Altiplano',
        'Sierra Madre Occidental',
        'Sierra Madre Oriental',
        'Sierra Madre del Sur'
      ];
    } catch (error) {
      console.error('Error al obtener regiones disponibles:', error);
      return [];
    }
  }

  // Sincronizar datos con Firebase
  async syncWithFirebase(): Promise<void> {
    try {
      console.log('Iniciando sincronización con Firebase...');
      
      // Obtener plantas desde Firebase
      const snapshot = await firestore()
        .collection(COLLECTIONS.PLANTS)
        .limit(1000)
        .get();

      let syncedCount = 0;
      
      for (const doc of snapshot.docs) {
        try {
          const plant = doc.data() as Plant;
          await plantDatabase.insertPlant(plant);
          this.plantsCache.set(plant.id, plant);
          syncedCount++;
        } catch (error) {
          console.warn(`Error al sincronizar planta ${doc.id}:`, error);
        }
      }

      console.log(`Sincronización completada: ${syncedCount} plantas sincronizadas`);
      
      // Limpiar caché de búsqueda
      this.searchCache.clear();
      
    } catch (error) {
      console.error('Error en sincronización con Firebase:', error);
      throw error;
    }
  }

  // Limpiar caché
  clearCache(): void {
    this.plantsCache.clear();
    this.searchCache.clear();
  }

  // Obtener estadísticas de la base de datos
  async getDatabaseStats(): Promise<{
    totalPlants: number;
    totalFamilies: number;
    totalRegions: number;
    lastSync: Date | null;
  }> {
    try {
      const totalPlants = await plantDatabase.getDatabaseSize();
      
      // Obtener familias y regiones únicas
      const families = await this.getAvailableFamilies();
      const regions = await this.getAvailableRegions();
      
      return {
        totalPlants,
        totalFamilies: families.length,
        totalRegions: regions.length,
        lastSync: new Date() // Esto se podría obtener de la base de datos
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalPlants: 0,
        totalFamilies: 0,
        totalRegions: 0,
        lastSync: null
      };
    }
  }
}

// Instancia global del servicio
export const plantDataService = PlantDataService.getInstance();