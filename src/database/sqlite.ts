import SQLite from 'react-native-sqlite-storage';
import { Plant, Identification, User, PlantCollection } from '../types';

// Configuración de SQLite
SQLite.DEBUG(true);
SQLite.enablePromise(true);

export class PlantDatabase {
  private database: SQLite.SQLiteDatabase | null = null;
  private readonly databaseName = 'PlantIdentifierMX.db';
  private readonly databaseVersion = '1.0';
  private readonly databaseDisplayname = 'Plant Identifier MX Database';
  private readonly databaseSize = 200000;

  // Inicializar base de datos
  async init(): Promise<void> {
    try {
      this.database = await SQLite.openDatabase({
        name: this.databaseName,
        version: this.databaseVersion,
        displayName: this.databaseDisplayname,
        size: this.databaseSize,
      });

      await this.createTables();
      console.log('Base de datos SQLite inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar base de datos:', error);
      throw error;
    }
  }

  // Crear tablas
  private async createTables(): Promise<void> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    // Tabla de plantas
    await this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY,
        scientificName TEXT NOT NULL,
        commonNames TEXT NOT NULL,
        family TEXT NOT NULL,
        origin TEXT NOT NULL,
        description TEXT NOT NULL,
        care TEXT NOT NULL,
        images TEXT NOT NULL,
        region TEXT NOT NULL,
        plantType TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Tabla de identificaciones
    await this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS identifications (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        plantId TEXT,
        imageUri TEXT NOT NULL,
        confidence REAL NOT NULL,
        predictions TEXT NOT NULL,
        confirmedPlantId TEXT,
        isConfirmed INTEGER NOT NULL DEFAULT 0,
        location TEXT,
        filters TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Tabla de usuarios
    await this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        displayName TEXT NOT NULL,
        photoURL TEXT,
        preferences TEXT NOT NULL,
        plantCollection TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Tabla de colección de plantas
    await this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS plant_collections (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        plantId TEXT NOT NULL,
        plant TEXT NOT NULL,
        addedAt TEXT NOT NULL,
        notes TEXT,
        personalImages TEXT
      );
    `);

    // Tabla de datos offline
    await this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS offline_data (
        id TEXT PRIMARY KEY,
        plants TEXT NOT NULL,
        modelVersion TEXT NOT NULL,
        lastSync TEXT NOT NULL,
        totalSize INTEGER NOT NULL
      );
    `);

    // Índices para mejorar rendimiento
    await this.database.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_plants_scientific_name ON plants(scientificName);
    `);
    await this.database.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_plants_family ON plants(family);
    `);
    await this.database.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_plants_region ON plants(region);
    `);
    await this.database.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_plants_type ON plants(plantType);
    `);
    await this.database.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_identifications_user ON identifications(userId);
    `);
    await this.database.executeSql(`
      CREATE INDEX IF NOT EXISTS idx_plant_collections_user ON plant_collections(userId);
    `);
  }

  // Métodos para plantas
  async insertPlant(plant: Plant): Promise<void> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const query = `
      INSERT OR REPLACE INTO plants 
      (id, scientificName, commonNames, family, origin, description, care, images, region, plantType, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.database.executeSql(query, [
      plant.id,
      plant.scientificName,
      JSON.stringify(plant.commonNames),
      plant.family,
      plant.origin,
      JSON.stringify(plant.description),
      JSON.stringify(plant.care),
      JSON.stringify(plant.images),
      JSON.stringify(plant.region),
      plant.plantType,
      plant.createdAt.toISOString(),
      plant.updatedAt.toISOString()
    ]);
  }

  async getPlant(id: string): Promise<Plant | null> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const [results] = await this.database.executeSql(
      'SELECT * FROM plants WHERE id = ?',
      [id]
    );

    if (results.rows.length === 0) return null;

    const row = results.rows.item(0);
    return this.parsePlantFromRow(row);
  }

  async searchPlants(filters: {
    region?: string;
    plantType?: string;
    family?: string;
    searchTerm?: string;
  }): Promise<Plant[]> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    let query = 'SELECT * FROM plants WHERE 1=1';
    const params: any[] = [];

    if (filters.region) {
      query += ' AND region LIKE ?';
      params.push(`%${filters.region}%`);
    }

    if (filters.plantType) {
      query += ' AND plantType = ?';
      params.push(filters.plantType);
    }

    if (filters.family) {
      query += ' AND family = ?';
      params.push(filters.family);
    }

    if (filters.searchTerm) {
      query += ' AND (scientificName LIKE ? OR commonNames LIKE ?)';
      params.push(`%${filters.searchTerm}%`, `%${filters.searchTerm}%`);
    }

    query += ' ORDER BY scientificName LIMIT 100';

    const [results] = await this.database.executeSql(query, params);
    const plants: Plant[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      plants.push(this.parsePlantFromRow(results.rows.item(i)));
    }

    return plants;
  }

  // Métodos para identificaciones
  async insertIdentification(identification: Identification): Promise<void> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const query = `
      INSERT OR REPLACE INTO identifications 
      (id, userId, plantId, imageUri, confidence, predictions, confirmedPlantId, isConfirmed, location, filters, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.database.executeSql(query, [
      identification.id,
      identification.userId,
      identification.plantId || null,
      identification.imageUri,
      identification.confidence,
      JSON.stringify(identification.predictions),
      identification.confirmedPlantId || null,
      identification.isConfirmed ? 1 : 0,
      identification.location ? JSON.stringify(identification.location) : null,
      JSON.stringify(identification.filters),
      identification.createdAt.toISOString(),
      identification.updatedAt.toISOString()
    ]);
  }

  async getUserIdentifications(userId: string): Promise<Identification[]> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const [results] = await this.database.executeSql(
      'SELECT * FROM identifications WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );

    const identifications: Identification[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      identifications.push(this.parseIdentificationFromRow(results.rows.item(i)));
    }

    return identifications;
  }

  // Métodos para usuarios
  async insertUser(user: User): Promise<void> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const query = `
      INSERT OR REPLACE INTO users 
      (id, email, displayName, photoURL, preferences, plantCollection, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await this.database.executeSql(query, [
      user.id,
      user.email,
      user.displayName,
      user.photoURL || null,
      JSON.stringify(user.preferences),
      JSON.stringify(user.plantCollection),
      user.createdAt.toISOString(),
      user.updatedAt.toISOString()
    ]);
  }

  async getUser(id: string): Promise<User | null> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const [results] = await this.database.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (results.rows.length === 0) return null;

    const row = results.rows.item(0);
    return this.parseUserFromRow(row);
  }

  // Métodos para colección de plantas
  async insertPlantCollection(collection: PlantCollection): Promise<void> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const query = `
      INSERT OR REPLACE INTO plant_collections 
      (id, userId, plantId, plant, addedAt, notes, personalImages)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await this.database.executeSql(query, [
      collection.id,
      collection.userId,
      collection.plantId,
      JSON.stringify(collection.plant),
      collection.addedAt.toISOString(),
      collection.notes || null,
      collection.personalImages ? JSON.stringify(collection.personalImages) : null
    ]);
  }

  async getUserPlantCollection(userId: string): Promise<PlantCollection[]> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const [results] = await this.database.executeSql(
      'SELECT * FROM plant_collections WHERE userId = ? ORDER BY addedAt DESC',
      [userId]
    );

    const collections: PlantCollection[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      collections.push(this.parsePlantCollectionFromRow(results.rows.item(i)));
    }

    return collections;
  }

  // Métodos de utilidad
  async getDatabaseSize(): Promise<number> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    const [results] = await this.database.executeSql(
      'SELECT COUNT(*) as count FROM plants'
    );
    return results.rows.item(0).count;
  }

  async clearDatabase(): Promise<void> {
    if (!this.database) throw new Error('Base de datos no inicializada');

    await this.database.executeSql('DELETE FROM plants');
    await this.database.executeSql('DELETE FROM identifications');
    await this.database.executeSql('DELETE FROM users');
    await this.database.executeSql('DELETE FROM plant_collections');
    await this.database.executeSql('DELETE FROM offline_data');
  }

  async close(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
    }
  }

  // Métodos de parsing
  private parsePlantFromRow(row: any): Plant {
    return {
      id: row.id,
      scientificName: row.scientificName,
      commonNames: JSON.parse(row.commonNames),
      family: row.family,
      origin: row.origin,
      description: JSON.parse(row.description),
      care: JSON.parse(row.care),
      images: JSON.parse(row.images),
      region: JSON.parse(row.region),
      plantType: row.plantType,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private parseIdentificationFromRow(row: any): Identification {
    return {
      id: row.id,
      userId: row.userId,
      plantId: row.plantId,
      imageUri: row.imageUri,
      confidence: row.confidence,
      predictions: JSON.parse(row.predictions),
      confirmedPlantId: row.confirmedPlantId,
      isConfirmed: row.isConfirmed === 1,
      location: row.location ? JSON.parse(row.location) : undefined,
      filters: JSON.parse(row.filters),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private parseUserFromRow(row: any): User {
    return {
      id: row.id,
      email: row.email,
      displayName: row.displayName,
      photoURL: row.photoURL,
      preferences: JSON.parse(row.preferences),
      plantCollection: JSON.parse(row.plantCollection),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  private parsePlantCollectionFromRow(row: any): PlantCollection {
    return {
      id: row.id,
      userId: row.userId,
      plantId: row.plantId,
      plant: JSON.parse(row.plant),
      addedAt: new Date(row.addedAt),
      notes: row.notes,
      personalImages: row.personalImages ? JSON.parse(row.personalImages) : undefined
    };
  }
}

// Instancia global de la base de datos
export const plantDatabase = new PlantDatabase();