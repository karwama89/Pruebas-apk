import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types/navigation';
import { Plant } from '../types/plant';

const { width } = Dimensions.get('window');

type GalleryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Gallery'>;

const GalleryScreen: React.FC = () => {
  const navigation = useNavigation<GalleryScreenNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectImage = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      includeBase64: false,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Error', 'No se pudo acceder a la galería');
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setSelectedImage(imageUri);
        }
      }
    });
  };

  const processImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    
    try {
      // Simular procesamiento de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular resultado de identificación
      const mockPlant: Plant = {
        id: '2',
        scientificName: 'Bougainvillea glabra',
        commonNames: ['Bugambilia', 'Santa Rita'],
        family: 'Nyctaginaceae',
        origin: 'Nativa',
        description: 'Arbusto trepador con flores pequeñas rodeadas de brácteas coloridas...',
        habitat: 'Jardines, parques, zonas urbanas',
        distribution: ['México', 'América del Sur'],
        phenology: {
          flowering: 'Todo el año en climas cálidos',
          fruiting: 'Después de la floración',
        },
        ecologicalImportance: 'Atrae polinizadores y pájaros',
        uses: {
          medicinal: true,
          culinary: false,
          ornamental: true,
          artisanal: false,
        },
        conservationStatus: 'No amenazada',
        care: {
          watering: 'Moderado, tolera sequía',
          light: 'Pleno sol',
          soil: 'Bien drenado',
          fertilization: 'Mensual en temporada de crecimiento',
          pruning: 'Regular para mantener forma',
          pestManagement: 'Resistente a la mayoría de plagas',
        },
        warnings: ['Puede causar irritación en la piel'],
        images: [selectedImage],
        category: 'Arbusto',
        toxicity: false,
      };

      navigation.navigate('PlantDetail', { plantId: mockPlant.id });
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar la imagen. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccionar Imagen</Text>
          <Text style={styles.subtitle}>
            Elige una foto de tu galería para identificar la planta
          </Text>
        </View>

        {!selectedImage ? (
          <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
            <Icon name="photo-library" size={60} color="#4CAF50" />
            <Text style={styles.selectButtonText}>Seleccionar de Galería</Text>
            <Text style={styles.selectButtonSubtext}>
              Toca para elegir una imagen
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            
            <View style={styles.imageActions}>
              <TouchableOpacity style={styles.actionButton} onPress={clearSelection}>
                <Icon name="close" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Cambiar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.processButton, isProcessing && styles.processButtonDisabled]} 
                onPress={processImage}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Icon name="search" size={24} color="#fff" />
                )}
                <Text style={styles.processButtonText}>
                  {isProcessing ? 'Procesando...' : 'Identificar Planta'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Consejos para mejor identificación:</Text>
          
          <View style={styles.tipItem}>
            <Icon name="lightbulb" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              Asegúrate de que la planta esté bien iluminada
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Icon name="center-focus-strong" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              Enfoca en las características distintivas (hojas, flores, frutos)
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Icon name="crop-free" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              Evita fondos muy complejos o sombras
            </Text>
          </View>
          
          <View style={styles.tipItem}>
            <Icon name="photo-camera" size={20} color="#FFD700" />
            <Text style={styles.tipText}>
              Cuantas más características visibles, mejor será la identificación
            </Text>
          </View>
        </View>
      </ScrollView>

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  selectButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 15,
    marginBottom: 5,
  },
  selectButtonSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#666',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
  },
  processButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
  },
  processButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
    flex: 1,
    lineHeight: 20,
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

export default GalleryScreen;