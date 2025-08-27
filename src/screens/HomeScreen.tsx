import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleCameraPress = () => {
    navigation.navigate('Camera');
  };

  const handleGalleryPress = () => {
    navigation.navigate('Gallery');
  };

  const handleAchievementsPress = () => {
    navigation.navigate('Achievements');
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#66BB6A', '#81C784']}
        style={styles.header}
      >
        <Text style={styles.title}>Identificador de Plantas MX</Text>
        <Text style={styles.subtitle}>
          Descubre la flora nativa de México con inteligencia artificial
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.mainActions}>
          <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPress}>
            <Icon name="camera-alt" size={40} color="#fff" />
            <Text style={styles.buttonText}>Tomar Foto</Text>
            <Text style={styles.buttonSubtext}>Identificar planta en tiempo real</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={handleGalleryPress}>
            <Icon name="photo-library" size={40} color="#fff" />
            <Text style={styles.buttonText}>Galería</Text>
            <Text style={styles.buttonSubtext}>Seleccionar imagen existente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={handleAchievementsPress}>
            <Icon name="emoji-events" size={30} color="#FFD700" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Plantas Identificadas</Text>
          </TouchableOpacity>

          <View style={styles.statCard}>
            <Icon name="local-florist" size={30} color="#4CAF50" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Logros Desbloqueados</Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Características</Text>
          
          <View style={styles.featureItem}>
            <Icon name="psychology" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>IA avanzada para identificación precisa</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="offline-pin" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Funciona sin conexión a internet</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="location-on" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Filtros por región y tipo de planta</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="eco" size={24} color="#4CAF50" />
            <Text style={styles.featureText}>Base de datos de flora mexicana</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  mainActions: {
    marginBottom: 30,
  },
  cameraButton: {
    backgroundColor: '#2196F3',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  galleryButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  buttonSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 15,
    flex: 1,
  },
});

export default HomeScreen;