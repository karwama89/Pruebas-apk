import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types/navigation';
import { Plant } from '../types/plant';

const { width } = Dimensions.get('window');

type ExploreScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ExploreScreen: React.FC = () => {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);

  useEffect(() => {
    // Simular datos de plantas
    const mockPlants: Plant[] = [
      {
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
      {
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
      {
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
      {
        id: '4',
        scientificName: 'Vanilla planifolia',
        commonNames: ['Vainilla', 'Vainilla mexicana'],
        family: 'Orchidaceae',
        origin: 'Endémica',
        description: 'Orquídea trepadora...',
        habitat: 'Selvas húmedas',
        distribution: ['México'],
        phenology: { flowering: 'Primavera', fruiting: 'Otoño' },
        ecologicalImportance: 'Polinización especializada',
        uses: { medicinal: false, culinary: true, ornamental: true, artisanal: false },
        conservationStatus: 'Vulnerable',
        care: { watering: 'Alto', light: 'Sombra parcial', soil: 'Húmedo', fertilization: 'Mensual', pruning: 'No requiere', pestManagement: 'Sensible' },
        warnings: ['Requiere cuidados especiales'],
        images: ['https://example.com/vainilla1.jpg'],
        category: 'Orquídea',
        toxicity: false,
      },
      {
        id: '5',
        scientificName: 'Quercus rugosa',
        commonNames: ['Encino', 'Roble'],
        family: 'Fagaceae',
        origin: 'Nativa',
        description: 'Árbol de hoja perenne...',
        habitat: 'Bosques de montaña',
        distribution: ['México', 'Centroamérica'],
        phenology: { flowering: 'Primavera', fruiting: 'Otoño' },
        ecologicalImportance: 'Hábitat para fauna',
        uses: { medicinal: true, culinary: false, ornamental: true, artisanal: true },
        conservationStatus: 'No amenazada',
        care: { watering: 'Moderado', light: 'Pleno sol', soil: 'Profundo', fertilization: 'Anual', pruning: 'Ocasional', pestManagement: 'Resistente' },
        warnings: ['Hojas pueden ser tóxicas'],
        images: ['https://example.com/encino1.jpg'],
        category: 'Árbol',
        toxicity: true,
      },
    ];

    setPlants(mockPlants);
    setFilteredPlants(mockPlants);
  }, []);

  useEffect(() => {
    filterPlants();
  }, [searchQuery, selectedCategory, selectedOrigin]);

  const filterPlants = () => {
    let filtered = plants;

    // Filtro por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(plant =>
        plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.commonNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        plant.family.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(plant => plant.category === selectedCategory);
    }

    // Filtro por origen
    if (selectedOrigin !== 'all') {
      filtered = filtered.filter(plant => plant.origin === selectedOrigin);
    }

    setFilteredPlants(filtered);
  };

  const categories = [
    { key: 'all', label: 'Todas', icon: 'list' },
    { key: 'Árbol', label: 'Árboles', icon: 'park' },
    { key: 'Arbusto', label: 'Arbustos', icon: 'nature' },
    { key: 'Flor', label: 'Flores', icon: 'local-florist' },
    { key: 'Cactácea', label: 'Cactáceas', icon: 'eco' },
    { key: 'Orquídea', label: 'Orquídeas', icon: 'spa' },
    { key: 'Hierba', label: 'Hierbas', icon: 'grass' },
    { key: 'Suculenta', label: 'Suculentas', icon: 'crop-square' },
  ];

  const origins = [
    { key: 'all', label: 'Todas', color: '#4CAF50' },
    { key: 'Nativa', label: 'Nativas', color: '#4CAF50' },
    { key: 'Endémica', label: 'Endémicas', color: '#9C27B0' },
    { key: 'Exótica', label: 'Exóticas', color: '#FF9800' },
  ];

  const renderPlantCard = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.plantCard}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
    >
      <Image
        source={{ uri: item.images[0] }}
        style={styles.plantImage}
        defaultSource={{ uri: 'https://via.placeholder.com/120x120' }}
      />
      
      <View style={styles.plantInfo}>
        <Text style={styles.plantName} numberOfLines={1}>
          {item.scientificName}
        </Text>
        <Text style={styles.plantCommonName} numberOfLines={1}>
          {item.commonNames[0]}
        </Text>
        
        <View style={styles.plantMeta}>
          <Text style={styles.familyText}>{item.family}</Text>
          <View style={[styles.originTag, { backgroundColor: origins.find(o => o.key === item.origin)?.color }]}>
            <Text style={styles.originTagText}>{item.origin}</Text>
          </View>
        </View>
        
        <View style={styles.usesContainer}>
          {Object.entries(item.uses).map(([use, available]) => (
            available && (
              <View key={use} style={styles.useTag}>
                <Text style={styles.useTagText}>
                  {use.charAt(0).toUpperCase() + use.slice(1)}
                </Text>
              </View>
            )
          ))}
        </View>
      </View>
      
      <View style={styles.cardArrow}>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  const renderCategoryButton = (category: { key: string; label: string; icon: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === category.key && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(category.key)}
    >
      <Icon
        name={category.icon}
        size={24}
        color={selectedCategory === category.key ? '#fff' : '#666'}
      />
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category.key && styles.categoryButtonTextActive
      ]}>
        {category.label}
      </Text>
    </TouchableOpacity>
  );

  const renderOriginButton = (origin: { key: string; label: string; color: string }) => (
    <TouchableOpacity
      style={[
        styles.originButton,
        selectedOrigin === origin.key && styles.originButtonActive,
        { borderColor: origin.color }
      ]}
      onPress={() => setSelectedOrigin(origin.key)}
    >
      <Text style={[
        styles.originButtonText,
        selectedOrigin === origin.key && { color: origin.color }
      ]}>
        {origin.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <Text style={styles.title}>Explorar Flora</Text>
        <Text style={styles.subtitle}>
          Descubre la biodiversidad de México
        </Text>
        
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar plantas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Categorías */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => renderCategoryButton(category))}
        </ScrollView>
      </View>

      {/* Orígenes */}
      <View style={styles.originsContainer}>
        <Text style={styles.sectionTitle}>Origen</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {origins.map(origin => renderOriginButton(origin))}
        </ScrollView>
      </View>

      {/* Resultados */}
      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            {filteredPlants.length} plantas encontradas
          </Text>
          <TouchableOpacity onPress={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedOrigin('all');
          }}>
            <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredPlants}
          renderItem={renderPlantCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Icon name="search-off" size={60} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No se encontraron plantas</Text>
              <Text style={styles.emptyStateSubtitle}>
                Intenta con otros filtros o términos de búsqueda
              </Text>
            </View>
          }
        />
      </View>
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
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  originsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  originButton: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  originButtonActive: {
    backgroundColor: 'transparent',
  },
  originButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#4CAF50',
    textDecorationLine: 'underline',
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
    width: 120,
    height: 120,
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
    fontStyle: 'italic',
  },
  plantCommonName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  plantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  familyText: {
    fontSize: 12,
    color: '#999',
  },
  originTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  originTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  usesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  useTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 2,
  },
  useTagText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardArrow: {
    justifyContent: 'center',
    paddingLeft: 10,
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

export default ExploreScreen;