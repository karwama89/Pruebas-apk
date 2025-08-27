import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types/navigation';
import { PlantHistory } from '../types/plant';

const { width } = Dimensions.get('window');

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const [plantHistory, setPlantHistory] = useState<PlantHistory[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    // Simular datos de historial
    const mockHistory: PlantHistory[] = [
      {
        id: '1',
        plantId: '1',
        plant: {
          id: '1',
          scientificName: 'Agave americana',
          commonNames: ['Maguey', 'Agave americano'],
          family: 'Asparagaceae',
          origin: 'Nativa',
          description: 'Planta suculenta perenne...',
          habitat: 'Zonas áridas',
          distribution: ['México', 'Estados Unidos'],
          phenology: { flowering: '15-25 años', fruiting: 'Después de floración' },
          ecologicalImportance: 'Importante para biodiversidad',
          uses: { medicinal: true, culinary: true, ornamental: true, artisanal: true },
          conservationStatus: 'No amenazada',
          care: { watering: 'Bajo', light: 'Pleno sol', soil: 'Bien drenado', fertilization: 'No requiere', pruning: 'Solo hojas muertas', pestManagement: 'Resistente' },
          warnings: ['Espinas afiladas'],
          images: ['https://example.com/agave1.jpg'],
          category: 'Suculenta',
          toxicity: false,
        },
        identification: {
          id: '1',
          plantId: '1',
          imageUri: 'https://example.com/agave1.jpg',
          confidence: 0.95,
          timestamp: new Date('2024-01-15'),
          location: { latitude: 19.4326, longitude: -99.1332, region: 'CDMX', municipality: 'Coyoacán' },
          filters: { region: 'CDMX', plantType: 'Suculenta', distribution: 'Nativa' },
          confirmed: true,
        },
        unlockedAt: new Date('2024-01-15'),
        isFavorite: true,
      },
      {
        id: '2',
        plantId: '2',
        plant: {
          id: '2',
          scientificName: 'Bougainvillea glabra',
          commonNames: ['Bugambilia', 'Santa Rita'],
          family: 'Nyctaginaceae',
          origin: 'Nativa',
          description: 'Arbusto trepador...',
          habitat: 'Jardines urbanos',
          distribution: ['México', 'América del Sur'],
          phenology: { flowering: 'Todo el año', fruiting: 'Después de floración' },
          ecologicalImportance: 'Atrae polinizadores',
          uses: { medicinal: true, culinary: false, ornamental: true, artisanal: false },
          conservationStatus: 'No amenazada',
          care: { watering: 'Moderado', light: 'Pleno sol', soil: 'Bien drenado', fertilization: 'Mensual', pruning: 'Regular', pestManagement: 'Resistente' },
          warnings: ['Puede irritar la piel'],
          images: ['https://example.com/bougainvillea1.jpg'],
          category: 'Arbusto',
          toxicity: false,
        },
        identification: {
          id: '2',
          plantId: '2',
          imageUri: 'https://example.com/bougainvillea1.jpg',
          confidence: 0.88,
          timestamp: new Date('2024-01-10'),
          location: { latitude: 19.4326, longitude: -99.1332, region: 'CDMX', municipality: 'Coyoacán' },
          filters: { region: 'CDMX', plantType: 'Arbusto', distribution: 'Nativa' },
          confirmed: false,
        },
        unlockedAt: new Date('2024-01-10'),
        isFavorite: false,
      },
      {
        id: '3',
        plantId: '3',
        plant: {
          id: '3',
          scientificName: 'Opuntia ficus-indica',
          commonNames: ['Nopal', 'Tuna'],
          family: 'Cactaceae',
          origin: 'Nativa',
          description: 'Cactus arbustivo...',
          habitat: 'Zonas áridas',
          distribution: ['México', 'Centroamérica'],
          phenology: { flowering: 'Primavera-verano', fruiting: 'Verano-otoño' },
          ecologicalImportance: 'Alimento para fauna',
          uses: { medicinal: true, culinary: true, ornamental: true, artisanal: true },
          conservationStatus: 'No amenazada',
          care: { watering: 'Bajo', light: 'Pleno sol', soil: 'Arenoso', fertilization: 'No requiere', pruning: 'Ocasional', pestManagement: 'Resistente' },
          warnings: ['Espinas pequeñas'],
          images: ['https://example.com/nopal1.jpg'],
          category: 'Cactácea',
          toxicity: false,
        },
        identification: {
          id: '3',
          plantId: '3',
          imageUri: 'https://example.com/nopal1.jpg',
          confidence: 0.92,
          timestamp: new Date('2024-01-05'),
          location: { latitude: 19.4326, longitude: -99.1332, region: 'CDMX', municipality: 'Coyoacán' },
          filters: { region: 'CDMX', plantType: 'Cactácea', distribution: 'Nativa' },
          confirmed: true,
        },
        unlockedAt: new Date('2024-01-05'),
        isFavorite: true,
      },
    ];

    setPlantHistory(mockHistory);
  }, []);

  const getFilteredHistory = () => {
    switch (selectedFilter) {
      case 'favorites':
        return plantHistory.filter(item => item.isFavorite);
      case 'recent':
        return plantHistory.sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
      case 'confirmed':
        return plantHistory.filter(item => item.identification.confirmed);
      default:
        return plantHistory;
    }
  };

  const renderPlantCard = ({ item }: { item: PlantHistory }) => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.plant.id })}
    >
      <Image
        source={{ uri: item.identification.imageUri }}
        style={styles.plantImage}
        defaultSource={{ uri: 'https://via.placeholder.com/100x100' }}
      />
      
      <View style={styles.plantInfo}>
        <Text style={styles.plantName} numberOfLines={1}>
          {item.plant.scientificName}
        </Text>
        <Text style={styles.plantCommonName} numberOfLines={1}>
          {item.plant.commonNames[0]}
        </Text>
        
        <View style={styles.plantMeta}>
          <View style={styles.metaItem}>
            <Icon name="calendar-today" size={14} color="#666" />
            <Text style={styles.metaText}>
              {item.unlockedAt.toLocaleDateString('es-MX')}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Icon name="psychology" size={14} color="#666" />
            <Text style={styles.metaText}>
              {Math.round(item.identification.confidence * 100)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.plant.category}</Text>
          </View>
          <View style={[styles.tag, styles[`origin${item.plant.origin}`]]}>
            <Text style={styles.tagText}>{item.plant.origin}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon
            name={item.isFavorite ? 'favorite' : 'favorite-border'}
            size={20}
            color={item.isFavorite ? '#e91e63' : '#999'}
          />
        </TouchableOpacity>
        
        {item.identification.confirmed && (
          <View style={styles.confirmedBadge}>
            <Icon name="check-circle" size={16} color="#4CAF50" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: string, label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Icon
        name={icon}
        size={20}
        color={selectedFilter === filter ? '#fff' : '#666'}
      />
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header con estadísticas */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Colección</Text>
        <Text style={styles.subtitle}>
          {plantHistory.length} plantas identificadas
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {plantHistory.filter(item => item.isFavorite).length}
            </Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {plantHistory.filter(item => item.identification.confirmed).length}
            </Text>
            <Text style={styles.statLabel}>Confirmadas</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {plantHistory.length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton('all', 'Todas', 'list')}
          {renderFilterButton('favorites', 'Favoritas', 'favorite')}
          {renderFilterButton('recent', 'Recientes', 'schedule')}
          {renderFilterButton('confirmed', 'Confirmadas', 'check-circle')}
        </ScrollView>
      </View>

      {/* Lista de plantas */}
      <FlatList
        data={getFilteredHistory()}
        renderItem={renderPlantCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="local-florist" size={60} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No hay plantas aún</Text>
            <Text style={styles.emptyStateSubtitle}>
              Identifica tu primera planta para comenzar tu colección
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    marginLeft: 15,
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  plantCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  plantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  plantInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  plantCommonName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  plantMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 2,
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
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
  },
  favoriteButton: {
    padding: 5,
  },
  confirmedBadge: {
    padding: 5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default HistoryScreen;