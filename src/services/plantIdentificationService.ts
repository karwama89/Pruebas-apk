import { CameraCapture, Identification, Plant, FilterOptions } from '../types';
import { plantIdentificationModel } from '../config/tensorflow';
import { plantDatabase } from '../database/sqlite';
import { firestore, COLLECTIONS } from '../config/firebase';
import { Platform, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export class PlantIdentificationService {
  private isProcessing = false;

  constructor() {
    this.requestPermissions();
  }

  // Solicitar permisos necesarios
  private async requestPermissions(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        // Permisos de Android
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message: 'La aplicación necesita acceso a la cámara para identificar plantas',
            buttonNeutral: 'Preguntar más tarde',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );

        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permiso de Almacenamiento',
            message: 'La aplicación necesita acceso al almacenamiento para guardar imágenes',
            buttonNeutral: 'Preguntar más tarde',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );

        if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED ||
            storagePermission !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Permisos no otorgados');
        }
      } else {
        // Permisos de iOS
        const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
        const photoLibraryPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

        if (cameraPermission !== RESULTS.GRANTED || photoLibraryPermission !== RESULTS.GRANTED) {
          console.warn('Permisos no otorgados');
        }
      }

      // Permiso de ubicación
      const locationPermission = await request(
        Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      if (locationPermission !== RESULTS.GRANTED) {
        console.warn('Permiso de ubicación no otorgado');
      }
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  }

  // Capturar imagen con la cámara
  async captureImage(): Promise<CameraCapture | null> {
    try {
      const result: ImagePickerResponse = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        saveToPhotos: true,
        cameraType: 'back',
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        if (asset.uri) {
          const location = await this.getCurrentLocation();
          
          return {
            uri: asset.uri,
            type: 'photo',
            width: asset.width || 0,
            height: asset.height || 0,
            timestamp: new Date(),
            location
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error al capturar imagen:', error);
      return null;
    }
  }

  // Seleccionar imagen de la galería
  async selectImageFromGallery(): Promise<CameraCapture | null> {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
        selectionLimit: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        if (asset.uri) {
          const location = await this.getCurrentLocation();
          
          return {
            uri: asset.uri,
            type: 'photo',
            width: asset.width || 0,
            height: asset.height || 0,
            timestamp: new Date(),
            location
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      return null;
    }
  }

  // Obtener ubicación actual
  private async getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
    region: string;
    municipality: string;
    state: string;
    country: string;
  } | undefined> {
    try {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              
              // Aquí se podría implementar un servicio de geocodificación inversa
              // para obtener región, municipio, estado y país
              // Por ahora retornamos valores por defecto
              resolve({
                latitude,
                longitude,
                region: 'Región',
                municipality: 'Municipio',
                state: 'Estado',
                country: 'México'
              });
            } catch (error) {
              reject(error);
            }
          },
          (error) => {
            console.warn('No se pudo obtener ubicación:', error);
            resolve(undefined);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      });
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      return undefined;
    }
  }

  // Identificar planta desde imagen
  async identifyPlant(
    imageCapture: CameraCapture,
    filters: FilterOptions = {},
    userId: string
  ): Promise<Identification> {
    if (this.isProcessing) {
      throw new Error('Ya hay una identificación en proceso');
    }

    this.isProcessing = true;

    try {
      console.log('Iniciando identificación de planta...');

      // Realizar predicción con el modelo de IA
      const predictions = await plantIdentificationModel.predict(imageCapture.uri);
      
      if (predictions.length === 0) {
        throw new Error('No se pudo identificar la planta');
      }

      // Obtener la predicción con mayor confianza
      const topPrediction = predictions[0];
      
      // Crear objeto de identificación
      const identification: Identification = {
        id: `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        plantId: topPrediction.plantId,
        imageUri: imageCapture.uri,
        confidence: topPrediction.confidence,
        predictions,
        confirmedPlantId: undefined,
        isConfirmed: false,
        location: imageCapture.location,
        filters,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Guardar en base de datos local
      await plantDatabase.insertIdentification(identification);

      // Guardar en Firebase si hay conexión
      try {
        await firestore()
          .collection(COLLECTIONS.IDENTIFICATIONS)
          .doc(identification.id)
          .set(identification);
      } catch (error) {
        console.warn('No se pudo sincronizar con Firebase:', error);
      }

      console.log('Identificación completada:', identification);
      return identification;

    } catch (error) {
      console.error('Error en la identificación:', error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  // Confirmar identificación
  async confirmIdentification(
    identificationId: string,
    confirmedPlantId: string,
    userId: string
  ): Promise<void> {
    try {
      // Actualizar en base de datos local
      const identification = await plantDatabase.getUserIdentifications(userId);
      const targetIdentification = identification.find(id => id.id === identificationId);
      
      if (targetIdentification) {
        targetIdentification.confirmedPlantId = confirmedPlantId;
        targetIdentification.isConfirmed = true;
        targetIdentification.updatedAt = new Date();
        
        await plantDatabase.insertIdentification(targetIdentification);
      }

      // Actualizar en Firebase
      try {
        await firestore()
          .collection(COLLECTIONS.IDENTIFICATIONS)
          .doc(identificationId)
          .update({
            confirmedPlantId,
            isConfirmed: true,
            updatedAt: new Date()
          });
      } catch (error) {
        console.warn('No se pudo sincronizar confirmación con Firebase:', error);
      }

      // Agregar a la colección personal del usuario
      const plant = await plantDatabase.getPlant(confirmedPlantId);
      if (plant) {
        const collection: PlantCollection = {
          id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          plantId: confirmedPlantId,
          plant,
          addedAt: new Date(),
          notes: undefined,
          personalImages: [targetIdentification?.imageUri]
        };

        await plantDatabase.insertPlantCollection(collection);
      }

    } catch (error) {
      console.error('Error al confirmar identificación:', error);
      throw error;
    }
  }

  // Obtener historial de identificaciones
  async getIdentificationHistory(userId: string): Promise<Identification[]> {
    try {
      return await plantDatabase.getUserIdentifications(userId);
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw error;
    }
  }

  // Obtener estadísticas de identificación
  async getIdentificationStats(userId: string): Promise<{
    total: number;
    confirmed: number;
    accuracy: number;
    topPlants: Array<{ plantId: string; count: number }>;
  }> {
    try {
      const identifications = await plantDatabase.getUserIdentifications(userId);
      
      const total = identifications.length;
      const confirmed = identifications.filter(id => id.isConfirmed).length;
      const accuracy = total > 0 ? (confirmed / total) * 100 : 0;

      // Contar plantas más identificadas
      const plantCounts: { [key: string]: number } = {};
      identifications.forEach(id => {
        if (id.confirmedPlantId) {
          plantCounts[id.confirmedPlantId] = (plantCounts[id.confirmedPlantId] || 0) + 1;
        }
      });

      const topPlants = Object.entries(plantCounts)
        .map(([plantId, count]) => ({ plantId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        total,
        confirmed,
        accuracy,
        topPlants
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  // Verificar si el servicio está disponible
  isAvailable(): boolean {
    return plantIdentificationModel.isLoaded() && !this.isProcessing;
  }

  // Obtener información del modelo
  getModelInfo() {
    return plantIdentificationModel.getModelInfo();
  }
}

// Instancia global del servicio
export const plantIdentificationService = new PlantIdentificationService();