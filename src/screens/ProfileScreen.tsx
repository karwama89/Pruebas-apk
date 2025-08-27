import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types/navigation';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => {
          // Aquí iría la lógica de logout
          Alert.alert('Sesión cerrada', 'Has cerrado sesión exitosamente');
        }},
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción no se puede deshacer. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {
          Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada');
        }},
      ]
    );
  };

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100x100' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Usuario Ejemplo</Text>
          <Text style={styles.profileEmail}>usuario@ejemplo.com</Text>
          <Text style={styles.profileMemberSince}>Miembro desde Enero 2024</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.editProfileButton}>
        <Icon name="edit" size={20} color="#4CAF50" />
        <Text style={styles.editProfileText}>Editar Perfil</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatsSection = () => (
    <View style={styles.statsSection}>
      <Text style={styles.sectionTitle}>Estadísticas</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Icon name="local-florist" size={30} color="#4CAF50" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Plantas Identificadas</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="emoji-events" size={30} color="#FFD700" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Logros Desbloqueados</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="favorite" size={30} color="#e91e63" />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="check-circle" size={30} color="#4CAF50" />
          <Text style={styles.statNumber}>10</Text>
          <Text style={styles.statLabel}>Confirmaciones</Text>
        </View>
      </View>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>Configuración</Text>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name="notifications" size={24} color="#666" />
          <Text style={styles.settingText}>Notificaciones</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
          thumbColor={notificationsEnabled ? '#fff' : '#fff'}
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name="location-on" size={24} color="#666" />
          <Text style={styles.settingText}>Ubicación</Text>
        </View>
        <Switch
          value={locationEnabled}
          onValueChange={setLocationEnabled}
          trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
          thumbColor={locationEnabled ? '#fff' : '#fff'}
        />
      </View>
      
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <Icon name="offline-pin" size={24} color="#666" />
          <Text style={styles.settingText}>Modo Offline</Text>
        </View>
        <Switch
          value={offlineMode}
          onValueChange={setOfflineMode}
          trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
          thumbColor={offlineMode ? '#fff' : '#fff'}
        />
      </View>
    </View>
  );

  const renderMenuSection = () => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Menú</Text>
      
      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Achievements')}>
        <View style={styles.menuItemLeft}>
          <Icon name="emoji-events" size={24} color="#FFD700" />
          <Text style={styles.menuItemText}>Logros</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Icon name="help" size={24} color="#2196F3" />
          <Text style={styles.menuItemText}>Ayuda y Soporte</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Icon name="info" size={24} color="#9C27B0" />
          <Text style={styles.menuItemText}>Acerca de</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Icon name="privacy-tip" size={24} color="#FF9800" />
          <Text style={styles.menuItemText}>Privacidad</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Icon name="description" size={24} color="#607D8B" />
          <Text style={styles.menuItemText}>Términos de Servicio</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  const renderAccountSection = () => (
    <View style={styles.accountSection}>
      <Text style={styles.sectionTitle}>Cuenta</Text>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Icon name="security" size={24} color="#4CAF50" />
          <Text style={styles.menuItemText}>Cambiar Contraseña</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Icon name="email" size={24} color="#2196F3" />
          <Text style={styles.menuItemText}>Cambiar Email</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Icon name="cloud-download" size={24} color="#FF9800" />
          <Text style={styles.menuItemText}>Descargar Datos</Text>
        </View>
        <Icon name="chevron-right" size={24} color="#ccc" />
      </TouchableOpacity>
    </View>
  );

  const renderDangerSection = () => (
    <View style={styles.dangerSection}>
      <Text style={styles.sectionTitle}>Zona de Peligro</Text>
      
      <TouchableOpacity style={styles.dangerItem} onPress={handleLogout}>
        <View style={styles.dangerItemLeft}>
          <Icon name="logout" size={24} color="#FF9800" />
          <Text style={styles.dangerItemText}>Cerrar Sesión</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
        <View style={styles.dangerItemLeft}>
          <Icon name="delete-forever" size={24} color="#f44336" />
          <Text style={styles.dangerItemText}>Eliminar Cuenta</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderProfileSection()}
      {renderStatsSection()}
      {renderSettingsSection()}
      {renderMenuSection()}
      {renderAccountSection()}
      {renderDangerSection()}
      
      <View style={styles.versionInfo}>
        <Text style={styles.versionText}>Versión 1.0.0</Text>
        <Text style={styles.versionSubtext}>© 2024 Plant Identifier MX</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 3,
  },
  profileMemberSince: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  statsSection: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  settingsSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  menuSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  accountSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  dangerSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dangerItemText: {
    fontSize: 16,
    color: '#f44336',
    marginLeft: 15,
    fontWeight: 'bold',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  versionSubtext: {
    fontSize: 12,
    color: '#ccc',
  },
});

export default ProfileScreen;