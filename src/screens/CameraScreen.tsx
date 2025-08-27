import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types/navigation';
import { Plant } from '../types/plant';

const { width, height } = Dimensions.get('window');

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

const CameraScreen: React.FC = () => {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const cameraRef = useRef<RNCamera>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);

  const takePicture = async () => {
    if (cameraRef.current && !isProcessing) {
      try {
        setIsProcessing(true);
        const options = {
          quality: 0.8,
          base64: false,
          skipProcessing: true,
        };
        
        const data = await cameraRef.current.takePictureAsync(options);
        
        // Simular procesamiento de IA
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simular resultado de identificación
        const mockPlant: Plant = {
          id: '1',
          scientificName: 'Agave americana',
          commonNames: ['Maguey', 'Agave americano'],
          family: 'Asparagaceae',
          origin: 'Nativa',
          description: 'Planta suculenta perenne con hojas carnosas y espinosas...',
          habitat: 'Zonas áridas y semiáridas',
          distribution: ['México', 'Estados Unidos'],
          phenology: {
            flowering: 'Una vez en la vida (15-25 años)',
            fruiting: 'Después de la floración',
          },
          ecologicalImportance: 'Importante para la biodiversidad del desierto',
          uses: {
            medicinal: true,
            culinary: true,
            ornamental: true,
            artisanal: true,
          },
          conservationStatus: 'No amenazada',
          care: {
            watering: 'Bajo, tolera sequía',
            light: 'Pleno sol',
            soil: 'Bien drenado, arenoso',
            fertilization: 'No requiere',
            pruning: 'Solo hojas muertas',
            pestManagement: 'Resistente a plagas',
          },
          warnings: ['Hojas con espinas afiladas'],
          images: [data.uri],
          category: 'Suculenta',
          toxicity: false,
        };

        navigation.navigate('PlantDetail', { plantId: mockPlant.id });
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto. Inténtalo de nuevo.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.on
        : RNCamera.Constants.FlashMode.off
    );
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
        androidCameraPermissionOptions={{
          title: 'Permiso para usar la cámara',
          message: 'Necesitamos acceso a tu cámara para identificar plantas',
          buttonPositive: 'Permitir',
          buttonNegative: 'Cancelar',
        }}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          {/* Guías de composición */}
          <View style={styles.compositionGuides}>
            <View style={styles.guideLine} />
            <View style={styles.guideLine} />
            <View style={styles.guideLine} />
            <View style={styles.guideLine} />
          </View>

          {/* Controles superiores */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Icon 
                name={flashMode === RNCamera.Constants.FlashMode.on ? 'flash-on' : 'flash-off'} 
                size={30} 
                color="#fff" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={switchCamera}>
              <Icon name="flip-camera-ios" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Instrucciones */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              Centra la planta en el marco
            </Text>
            <Text style={styles.instructionSubtext}>
              Asegúrate de que esté bien iluminada
            </Text>
          </View>

          {/* Botón de captura */}
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>
          </View>

          {/* Indicador de procesamiento */}
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <View style={styles.processingCard}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.processingText}>Analizando imagen...</Text>
                <Text style={styles.processingSubtext}>
                  Identificando la planta con IA
                </Text>
              </View>
            </View>
          )}
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  compositionGuides: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  instructionSubtext: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  processingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default CameraScreen;