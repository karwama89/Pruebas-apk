import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { Platform } from 'react-native';
import { STORAGE_PATHS, CACHE_CONFIG } from './firebase';

// Configuración de TensorFlow
export const TENSORFLOW_CONFIG = {
  MODEL_URL: 'https://storage.googleapis.com/plant-identifier-mx/models/plant_classifier_v1.tflite',
  MODEL_SIZE: 25 * 1024 * 1024, // 25MB
  INPUT_SHAPE: [1, 224, 224, 3], // Tamaño de entrada estándar
  OUTPUT_CLASSES: 1000, // Número de especies de plantas
  CONFIDENCE_THRESHOLD: 0.7,
  MAX_PREDICTIONS: 5,
  PREPROCESSING: {
    NORMALIZE: true,
    MEAN: [0.485, 0.456, 0.406], // Valores de normalización ImageNet
    STD: [0.229, 0.224, 0.225]
  }
} as const;

// Clase para manejar el modelo de IA
export class PlantIdentificationModel {
  private model: tf.GraphModel | null = null;
  private isModelLoaded = false;
  private modelVersion = 'v1.0.0';

  constructor() {
    this.initializeTensorFlow();
  }

  // Inicializar TensorFlow
  private async initializeTensorFlow() {
    try {
      await tf.ready();
      console.log('TensorFlow inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar TensorFlow:', error);
      throw error;
    }
  }

  // Cargar el modelo
  async loadModel(): Promise<void> {
    try {
      if (this.isModelLoaded) {
        return;
      }

      console.log('Cargando modelo de identificación de plantas...');
      
      // Cargar modelo desde URL o archivo local
      this.model = await tf.loadGraphModel(TENSORFLOW_CONFIG.MODEL_URL);
      
      // Warmup del modelo
      const dummyInput = tf.zeros(TENSORFLOW_CONFIG.INPUT_SHAPE);
      await this.model.predict(dummyInput);
      dummyInput.dispose();
      
      this.isModelLoaded = true;
      console.log('Modelo cargado correctamente');
    } catch (error) {
      console.error('Error al cargar el modelo:', error);
      throw error;
    }
  }

  // Preprocesar imagen
  private preprocessImage(imageUri: string): tf.Tensor3D {
    // Convertir imagen a tensor
    const image = tf.image.decodeImage(imageUri, 3);
    
    // Redimensionar a 224x224
    const resized = tf.image.resizeBilinear(image, [224, 224]);
    
    // Normalizar valores de píxeles
    const normalized = tf.div(resized, 255.0);
    
    // Aplicar normalización ImageNet
    const mean = tf.tensor1d(TENSORFLOW_CONFIG.PREPROCESSING.MEAN);
    const std = tf.tensor1d(TENSORFLOW_CONFIG.PREPROCESSING.STD);
    
    const normalizedImage = tf.sub(normalized, mean);
    const finalImage = tf.div(normalizedImage, std);
    
    // Limpiar tensores intermedios
    image.dispose();
    resized.dispose();
    normalized.dispose();
    mean.dispose();
    std.dispose();
    normalizedImage.dispose();
    
    return finalImage;
  }

  // Realizar predicción
  async predict(imageUri: string): Promise<Array<{
    plantId: string;
    confidence: number;
    scientificName: string;
    commonNames: string[];
  }>> {
    try {
      if (!this.isModelLoaded) {
        await this.loadModel();
      }

      if (!this.model) {
        throw new Error('Modelo no cargado');
      }

      // Preprocesar imagen
      const inputTensor = this.preprocessImage(imageUri);
      
      // Agregar dimensión de batch
      const batchedInput = inputTensor.expandDims(0);
      
      // Realizar predicción
      const predictions = await this.model.predict(batchedInput) as tf.Tensor;
      
      // Obtener top-k predicciones
      const topK = await tf.topk(predictions, TENSORFLOW_CONFIG.MAX_PREDICTIONS);
      
      // Convertir a arrays
      const indices = await topK.indices.array();
      const values = await topK.values.array();
      
      // Limpiar tensores
      inputTensor.dispose();
      batchedInput.dispose();
      predictions.dispose();
      topK.indices.dispose();
      topK.values.dispose();
      
      // Formatear resultados
      const results = [];
      for (let i = 0; i < indices[0].length; i++) {
        const confidence = values[0][i];
        if (confidence >= TENSORFLOW_CONFIG.CONFIDENCE_THRESHOLD) {
          results.push({
            plantId: `plant_${indices[0][i]}`,
            confidence: confidence,
            scientificName: `Especie ${indices[0][i]}`, // Esto se mapearía con la base de datos
            commonNames: [`Nombre común ${indices[0][i]}`]
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error en la predicción:', error);
      throw error;
    }
  }

  // Verificar si el modelo está cargado
  isLoaded(): boolean {
    return this.isModelLoaded;
  }

  // Obtener información del modelo
  getModelInfo() {
    return {
      version: this.modelVersion,
      inputShape: TENSORFLOW_CONFIG.INPUT_SHAPE,
      outputClasses: TENSORFLOW_CONFIG.OUTPUT_CLASSES,
      modelSize: TENSORFLOW_CONFIG.MODEL_SIZE
    };
  }

  // Descargar modelo para uso offline
  async downloadModelForOffline(): Promise<string> {
    try {
      // Implementar descarga del modelo para uso offline
      console.log('Descargando modelo para uso offline...');
      
      // Aquí se implementaría la lógica de descarga
      // y almacenamiento local del modelo
      
      return 'modelo_descargado.tflite';
    } catch (error) {
      console.error('Error al descargar modelo:', error);
      throw error;
    }
  }

  // Limpiar recursos
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isModelLoaded = false;
  }
}

// Instancia global del modelo
export const plantIdentificationModel = new PlantIdentificationModel();