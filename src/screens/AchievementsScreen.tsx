import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types/navigation';
import { Achievement } from '../types/plant';

const { width } = Dimensions.get('window');

type AchievementsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Achievements'>;

const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation<AchievementsScreenNavigationProp>();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    // Simular datos de logros
    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'Primer Paso',
        description: 'Identifica tu primera planta',
        icon: 'local-florist',
        requiredCount: 1,
        unlocked: true,
        unlockedAt: new Date('2024-01-05'),
        progress: 1,
      },
      {
        id: '2',
        title: 'Explorador Novato',
        description: 'Identifica 5 plantas diferentes',
        icon: 'explore',
        requiredCount: 5,
        unlocked: true,
        unlockedAt: new Date('2024-01-10'),
        progress: 5,
      },
      {
        id: '3',
        title: 'Botánico Aficionado',
        description: 'Identifica 10 plantas diferentes',
        icon: 'school',
        requiredCount: 10,
        unlocked: false,
        progress: 12,
      },
      {
        id: '4',
        title: 'Coleccionista',
        description: 'Identifica 25 plantas diferentes',
        icon: 'collections',
        requiredCount: 25,
        unlocked: false,
        progress: 12,
      },
      {
        id: '5',
        title: 'Experto en Flora',
        description: 'Identifica 50 plantas diferentes',
        icon: 'psychology',
        requiredCount: 50,
        unlocked: false,
        progress: 12,
      },
      {
        id: '6',
        title: 'Maestro Botánico',
        description: 'Identifica 100 plantas diferentes',
        icon: 'emoji-events',
        requiredCount: 100,
        unlocked: false,
        progress: 12,
      },
      {
        id: '7',
        title: 'Favoritos',
        description: 'Marca 10 plantas como favoritas',
        icon: 'favorite',
        requiredCount: 10,
        unlocked: false,
        progress: 8,
      },
      {
        id: '8',
        title: 'Confirmador',
        description: 'Confirma 20 identificaciones',
        icon: 'check-circle',
        requiredCount: 20,
        unlocked: false,
        progress: 10,
      },
      {
        id: '9',
        title: 'Variedad',
        description: 'Identifica plantas de 5 categorías diferentes',
        icon: 'category',
        requiredCount: 5,
        unlocked: false,
        progress: 4,
      },
      {
        id: '10',
        title: 'Nativo',
        description: 'Identifica 15 plantas nativas',
        icon: 'eco',
        requiredCount: 15,
        unlocked: false,
        progress: 9,
      },
      {
        id: '11',
        title: 'Endémico',
        description: 'Identifica 5 plantas endémicas',
        icon: 'park',
        requiredCount: 5,
        unlocked: false,
        progress: 2,
      },
      {
        id: '12',
        title: 'Consistente',
        description: 'Identifica plantas durante 7 días consecutivos',
        icon: 'schedule',
        requiredCount: 7,
        unlocked: false,
        progress: 3,
      },
    ];

    setAchievements(mockAchievements);
    
    // Calcular progreso total
    const unlockedCount = mockAchievements.filter(a => a.unlocked).length;
    const totalCount = mockAchievements.length;
    setTotalProgress((unlockedCount / totalCount) * 100);
  }, []);

  const renderAchievementCard = ({ item }: { item: Achievement }) => (
    <View style={[
      styles.achievementCard,
      item.unlocked && styles.achievementCardUnlocked
    ]}>
      <View style={styles.achievementIcon}>
        <Icon 
          name={item.icon} 
          size={40} 
          color={item.unlocked ? '#FFD700' : '#ccc'} 
        />
        {item.unlocked && (
          <View style={styles.unlockBadge}>
            <Icon name="check" size={16} color="#fff" />
          </View>
        )}
      </View>
      
      <View style={styles.achievementInfo}>
        <Text style={[
          styles.achievementTitle,
          item.unlocked && styles.achievementTitleUnlocked
        ]}>
          {item.title}
        </Text>
        <Text style={styles.achievementDescription}>
          {item.description}
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${Math.min((item.progress / item.requiredCount) * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {item.progress}/{item.requiredCount}
          </Text>
        </View>
        
        {item.unlocked && (
          <Text style={styles.unlockDate}>
            Desbloqueado el {item.unlockedAt?.toLocaleDateString('es-MX')}
          </Text>
        )}
      </View>
    </View>
  );

  const renderProgressHeader = () => (
    <View style={styles.progressHeader}>
      <View style={styles.progressCircle}>
        <Text style={styles.progressPercentage}>
          {Math.round(totalProgress)}%
        </Text>
        <Text style={styles.progressLabel}>Completado</Text>
      </View>
      
      <View style={styles.progressStats}>
        <View style={styles.progressStat}>
          <Text style={styles.progressStatNumber}>
            {achievements.filter(a => a.unlocked).length}
          </Text>
          <Text style={styles.progressStatLabel}>Desbloqueados</Text>
        </View>
        
        <View style={styles.progressStat}>
          <Text style={styles.progressStatNumber}>
            {achievements.filter(a => !a.unlocked).length}
          </Text>
          <Text style={styles.progressStatLabel}>Pendientes</Text>
        </View>
        
        <View style={styles.progressStat}>
          <Text style={styles.progressStatNumber}>
            {achievements.length}
          </Text>
          <Text style={styles.progressStatLabel}>Total</Text>
        </View>
      </View>
    </View>
  );

  const renderCategorySection = (title: string, icon: string, achievements: Achievement[]) => (
    <View style={styles.categorySection}>
      <View style={styles.categoryHeader}>
        <Icon name={icon} size={24} color="#4CAF50" />
        <Text style={styles.categoryTitle}>{title}</Text>
      </View>
      
      {achievements.map(achievement => (
        <View key={achievement.id} style={styles.achievementItem}>
          <View style={styles.achievementItemIcon}>
            <Icon 
              name={achievement.icon} 
              size={24} 
              color={achievement.unlocked ? '#FFD700' : '#ccc'} 
            />
          </View>
          
          <View style={styles.achievementItemInfo}>
            <Text style={[
              styles.achievementItemTitle,
              achievement.unlocked && styles.achievementItemTitleUnlocked
            ]}>
              {achievement.title}
            </Text>
            <Text style={styles.achievementItemDescription}>
              {achievement.description}
            </Text>
          </View>
          
          <View style={styles.achievementItemProgress}>
            <Text style={styles.achievementItemProgressText}>
              {achievement.progress}/{achievement.requiredCount}
            </Text>
            {achievement.unlocked && (
              <Icon name="check-circle" size={20} color="#4CAF50" />
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const getAchievementsByCategory = () => {
    const identification = achievements.filter(a => 
      a.title.includes('Identifica') || a.title.includes('Identifica')
    );
    const collection = achievements.filter(a => 
      a.title.includes('Favoritos') || a.title.includes('Confirmador') || a.title.includes('Variedad')
    );
    const special = achievements.filter(a => 
      a.title.includes('Nativo') || a.title.includes('Endémico') || a.title.includes('Consistente')
    );
    
    return { identification, collection, special };
  };

  const categories = getAchievementsByCategory();

  return (
    <ScrollView style={styles.container}>
      {/* Header con progreso general */}
      {renderProgressHeader()}

      {/* Logros destacados */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Logros Destacados</Text>
        <FlatList
          data={achievements.filter(a => a.unlocked)}
          renderItem={renderAchievementCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>

      {/* Categorías de logros */}
      <View style={styles.categoriesContainer}>
        {renderCategorySection('Identificación', 'local-florist', categories.identification)}
        {renderCategorySection('Colección', 'collections', categories.collection)}
        {renderCategorySection('Especiales', 'star', categories.special)}
      </View>

      {/* Logros próximos a desbloquear */}
      <View style={styles.upcomingSection}>
        <Text style={styles.sectionTitle}>Próximos a Desbloquear</Text>
        {achievements
          .filter(a => !a.unlocked)
          .sort((a, b) => (b.progress / b.requiredCount) - (a.progress / a.requiredCount))
          .slice(0, 3)
          .map(achievement => (
            <View key={achievement.id} style={styles.upcomingItem}>
              <Icon name={achievement.icon} size={24} color="#FF9800" />
              <View style={styles.upcomingInfo}>
                <Text style={styles.upcomingTitle}>{achievement.title}</Text>
                <Text style={styles.upcomingDescription}>{achievement.description}</Text>
                <View style={styles.upcomingProgress}>
                  <View style={styles.upcomingProgressBar}>
                    <View 
                      style={[
                        styles.upcomingProgressFill,
                        { width: `${(achievement.progress / achievement.requiredCount) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.upcomingProgressText}>
                    {achievement.progress}/{achievement.requiredCount}
                  </Text>
                </View>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  featuredSection: {
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
  featuredList: {
    paddingRight: 20,
  },
  achievementCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: 200,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  achievementCardUnlocked: {
    backgroundColor: '#fff',
    borderColor: '#FFD700',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  achievementIcon: {
    position: 'relative',
    marginBottom: 10,
  },
  unlockBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementInfo: {
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementTitleUnlocked: {
    color: '#333',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 16,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  progressBar: {
    width: 100,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#666',
  },
  unlockDate: {
    fontSize: 10,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  categoriesContainer: {
    padding: 20,
  },
  categorySection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementItemIcon: {
    marginRight: 15,
  },
  achievementItemInfo: {
    flex: 1,
  },
  achievementItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 2,
  },
  achievementItemTitleUnlocked: {
    color: '#333',
  },
  achievementItemDescription: {
    fontSize: 12,
    color: '#999',
  },
  achievementItemProgress: {
    alignItems: 'center',
  },
  achievementItemProgressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  upcomingSection: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  upcomingInfo: {
    flex: 1,
    marginLeft: 15,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  upcomingDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  upcomingProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginRight: 10,
  },
  upcomingProgressFill: {
    height: '100%',
    backgroundColor: '#FF9800',
    borderRadius: 2,
  },
  upcomingProgressText: {
    fontSize: 10,
    color: '#666',
  },
});

export default AchievementsScreen;