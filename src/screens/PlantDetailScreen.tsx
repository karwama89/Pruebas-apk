import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types/navigation';
import { Plant } from '../types/plant';

const { width } = Dimensions.get('window');

type PlantDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PlantDetail'>;
type PlantDetailScreenRouteProp = RouteProp<RootStackParamList, 'PlantDetail'>;

const PlantDetailScreen: React.FC = () => {
  const navigation = useNavigation<PlantDetailScreenNavigationProp>();
  const route = useRoute<PlantDetailScreenRouteProp>();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Simular carga de datos de la planta
    const mockPlant: Plant = {
      id: route.params.plantId,
      scientificName: 'Agave americana',
      commonNames: ['Maguey', 'Agave americano', 'Pita'],
      family: 'Asparagaceae',
      origin: 'Nativa',
      description: 'Planta suculenta perenne que forma una roseta de hojas carnosas, gruesas y espinosas. Las hojas son de color verde grisáceo, con márgenes espinosos y una espina terminal afilada. Puede alcanzar hasta 2 metros de altura y 3 metros de diámetro.',
      habitat: 'Zonas áridas y semiáridas, laderas rocosas, terrenos secos y pedregosos. Se adapta bien a suelos pobres y condiciones de sequía.',
      distribution: ['México', 'Estados Unidos', 'Centroamérica'],
      phenology: {
        flowering: 'Una vez en la vida (15-25 años)',
        fruiting: 'Después de la floración, la planta muere',
      },
      ecologicalImportance: 'Importante para la biodiversidad del desierto, proporciona refugio y alimento para diversas especies de fauna. Sus flores son polinizadas por murciélagos y polillas nocturnas.',
      uses: {
        medicinal: true,
        culinary: true,
        ornamental: true,
        artisanal: true,
      },
      conservationStatus: 'No amenazada',
      care: {
        watering: 'Bajo, tolera sequía extrema. Riego ocasional en verano.',
        light: 'Pleno sol, tolera sombra parcial',
        soil: 'Bien drenado, arenoso, pedregoso. pH neutro a alcalino.',
        fertilization: 'No requiere fertilización adicional',
        pruning: 'Solo hojas muertas o dañadas',
        pestManagement: 'Muy resistente a plagas y enfermedades',
      },
      warnings: ['Hojas con espinas afiladas que pueden causar heridas', 'Savia puede causar irritación en la piel'],
      images: [
        'https://example.com/agave1.jpg',
        'https://example.com/agave2.jpg',
        'https://example.com/agave3.jpg',
      ],
      category: 'Suculenta',
      toxicity: false,
    };

    setPlant(mockPlant);
  }, [route.params.plantId]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      isFavorite ? 'La planta se eliminó de tus favoritos' : 'La planta se agregó a tus favoritos'
    );
  };

  const handleShare = () => {
    Alert.alert('Compartir', 'Función de compartir en desarrollo');
  };

  const handleConfirmIdentification = () => {
    Alert.alert(
      'Confirmar Identificación',
      '¿La identificación es correcta?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Sí', 
          onPress: () => {
            Alert.alert('¡Gracias!', 'Tu confirmación ayuda a mejorar la IA');
          }
        },
      ]
    );
  };

  if (!plant) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Imagen principal */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: plant.images[currentImageIndex] || 'https://via.placeholder.com/400x300' }} 
          style={styles.mainImage} 
        />
        
        {/* Indicadores de imagen */}
        {plant.images.length > 1 && (
          <View style={styles.imageIndicators}>
            {plant.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.imageIndicator,
                  index === currentImageIndex && styles.imageIndicatorActive
                ]}
              />
            ))}
          </View>
        )}

        {/* Botones de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleFavorite}>
            <Icon 
              name={isFavorite ? 'favorite' : 'favorite-border'} 
              size={24} 
              color={isFavorite ? '#e91e63' : '#fff'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Icon name="share" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Información básica */}
      <View style={styles.basicInfo}>
        <Text style={styles.scientificName}>{plant.scientificName}</Text>
        <Text style={styles.commonNames}>{plant.commonNames.join(', ')}</Text>
        
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{plant.category}</Text>
          </View>
          <View style={[styles.tag, styles[`origin${plant.origin}`]]}>
            <Text style={styles.tagText}>{plant.origin}</Text>
          </View>
          {plant.toxicity && (
            <View style={styles.toxicityTag}>
              <Icon name="warning" size={16} color="#fff" />
              <Text style={styles.tagText}>Tóxica</Text>
            </View>
          )}
        </View>
      </View>

      {/* Descripción */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{plant.description}</Text>
      </View>

      {/* Familia y hábitat */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clasificación</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Familia:</Text>
          <Text style={styles.infoValue}>{plant.family}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Hábitat:</Text>
          <Text style={styles.infoValue}>{plant.habitat}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Distribución:</Text>
          <Text style={styles.infoValue}>{plant.distribution.join(', ')}</Text>
        </View>
      </View>

      {/* Fenología */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fenología</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Floración:</Text>
          <Text style={styles.infoValue}>{plant.phenology.flowering}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fructificación:</Text>
          <Text style={styles.infoValue}>{plant.phenology.fruiting}</Text>
        </View>
      </View>

      {/* Usos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usos</Text>
        <View style={styles.usesGrid}>
          {Object.entries(plant.uses).map(([use, available]) => (
            <View key={use} style={styles.useItem}>
              <Icon 
                name={available ? 'check-circle' : 'cancel'} 
                size={20} 
                color={available ? '#4CAF50' : '#999'} 
              />
              <Text style={[styles.useText, !available && styles.useTextDisabled]}>
                {use.charAt(0).toUpperCase() + use.slice(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Cuidados */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuidados</Text>
        <View style={styles.careGrid}>
          <View style={styles.careItem}>
            <Icon name="water-drop" size={20} color="#2196F3" />
            <Text style={styles.careLabel}>Riego</Text>
            <Text style={styles.careValue}>{plant.care.watering}</Text>
          </View>
          <View style={styles.careItem}>
            <Icon name="wb-sunny" size={20} color="#FF9800" />
            <Text style={styles.careLabel}>Luz</Text>
            <Text style={styles.careValue}>{plant.care.light}</Text>
          </View>
          <View style={styles.careItem}>
            <Icon name="terrain" size={20} color="#795548" />
            <Text style={styles.careLabel}>Suelo</Text>
            <Text style={styles.careValue}>{plant.care.soil}</Text>
          </View>
        </View>
      </View>

      {/* Advertencias */}
      {plant.warnings.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advertencias</Text>
          {plant.warnings.map((warning, index) => (
            <View key={index} style={styles.warningItem}>
              <Icon name="warning" size={20} color="#FF9800" />
              <Text style={styles.warningText}>{warning}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Botón de confirmación */}
      <View style={styles.confirmationSection}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmIdentification}>
          <Icon name="check-circle" size={24} color="#fff" />
          <Text style={styles.confirmButtonText}>Confirmar Identificación</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  imageIndicatorActive: {
    backgroundColor: '#fff',
  },
  actionButtons: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  basicInfo: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  scientificName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  commonNames: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
  },
  originNativa: {
    backgroundColor: '#4CAF50',
  },
  originEndémica: {
    backgroundColor: '#9C27B0',
  },
  originExótica: {
    backgroundColor: '#FF9800',
  },
  toxicityTag: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  usesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  useItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  useText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  useTextDisabled: {
    color: '#999',
  },
  careGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  careItem: {
    width: '50%',
    marginBottom: 15,
    alignItems: 'center',
  },
  careLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    marginBottom: 3,
  },
  careValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    flex: 1,
    lineHeight: 20,
  },
  confirmationSection: {
    padding: 20,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default PlantDetailScreen;