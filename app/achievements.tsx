import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Trophy, Lock, Info } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredCount: number;
  type: 'saved' | 'rated' | 'completed' | 'submitted' | 'vibes';
  unlocked: boolean;
  progress: number;
}

export default function AchievementsScreen() {
  const { colors, isDark } = useTheme();
  const { savedDateIdeas, dateRatings } = useAppStore();
  const { user } = useAuthStore();
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const detailsAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    // Generate achievements based on user data
    const savedCount = savedDateIdeas.length;
    const ratedCount = Object.keys(dateRatings).length;
    const completedCount = 0; // This would come from a real backend
    const submittedCount = 0; // This would come from a real backend
    const vibesCount = 0; // This would come from a real backend
    
    const achievementsList: Achievement[] = [
      {
        id: 'saved-1',
        title: 'Idea Collector',
        description: 'Save your first date idea',
        icon: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 1,
        type: 'saved',
        unlocked: savedCount >= 1,
        progress: Math.min(savedCount / 1, 1)
      },
      {
        id: 'saved-5',
        title: 'Date Planner',
        description: 'Save 5 date ideas',
        icon: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 5,
        type: 'saved',
        unlocked: savedCount >= 5,
        progress: Math.min(savedCount / 5, 1)
      },
      {
        id: 'saved-10',
        title: 'Date Enthusiast',
        description: 'Save 10 date ideas',
        icon: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 10,
        type: 'saved',
        unlocked: savedCount >= 10,
        progress: Math.min(savedCount / 10, 1)
      },
      {
        id: 'rated-1',
        title: 'Critic',
        description: 'Rate your first date idea',
        icon: 'https://images.unsplash.com/photo-1526662092594-e98c1e356d6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 1,
        type: 'rated',
        unlocked: ratedCount >= 1,
        progress: Math.min(ratedCount / 1, 1)
      },
      {
        id: 'rated-5',
        title: 'Feedback Pro',
        description: 'Rate 5 date ideas',
        icon: 'https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 5,
        type: 'rated',
        unlocked: ratedCount >= 5,
        progress: Math.min(ratedCount / 5, 1)
      },
      {
        id: 'completed-1',
        title: 'First Date',
        description: 'Complete your first date',
        icon: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 1,
        type: 'completed',
        unlocked: completedCount >= 1,
        progress: Math.min(completedCount / 1, 1)
      },
      {
        id: 'completed-5',
        title: 'Date Master',
        description: 'Complete 5 dates',
        icon: 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 5,
        type: 'completed',
        unlocked: completedCount >= 5,
        progress: Math.min(completedCount / 5, 1)
      },
      {
        id: 'submitted-1',
        title: 'Contributor',
        description: 'Submit your first date idea',
        icon: 'https://images.unsplash.com/photo-1565122256258-9a86523f49ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 1,
        type: 'submitted',
        unlocked: submittedCount >= 1,
        progress: Math.min(submittedCount / 1, 1)
      },
      {
        id: 'vibes-3',
        title: 'Versatile Dater',
        description: 'Try date ideas with 3 different vibes',
        icon: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        requiredCount: 3,
        type: 'vibes',
        unlocked: vibesCount >= 3,
        progress: Math.min(vibesCount / 3, 1)
      }
    ];
    
    setAchievements(achievementsList);
  }, [savedDateIdeas, dateRatings]);
  
  const handleAchievementPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowDetails(true);
    
    Animated.timing(detailsAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };
  
  const closeDetails = () => {
    Animated.timing(detailsAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      setShowDetails(false);
      setSelectedAchievement(null);
    });
  };
  
  const goBack = () => {
    router.back();
  };
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'saved':
        return 'Saved Ideas';
      case 'rated':
        return 'Rated Ideas';
      case 'completed':
        return 'Completed Dates';
      case 'submitted':
        return 'Submitted Ideas';
      case 'vibes':
        return 'Different Vibes';
      default:
        return type;
    }
  };
  
  // Group achievements by type
  const groupedAchievements: Record<string, Achievement[]> = {};
  achievements.forEach(achievement => {
    if (!groupedAchievements[achievement.type]) {
      groupedAchievements[achievement.type] = [];
    }
    groupedAchievements[achievement.type].push(achievement);
  });
  
  // Calculate total progress
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const progressPercentage = totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Achievements</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <View style={styles.statsHeader}>
              <Trophy size={24} color={colors.primary} />
              <Text style={[styles.statsTitle, { color: colors.text }]}>Your Progress</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: colors.primary,
                      width: `${progressPercentage}%`
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: colors.text }]}>
                {unlockedAchievements} of {totalAchievements} achievements unlocked
              </Text>
            </View>
          </View>
        </View>
        
        {Object.entries(groupedAchievements).map(([type, achievements]) => (
          <View key={type} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {getTypeLabel(type)}
            </Text>
            
            <View style={styles.achievementsGrid}>
              {achievements.map(achievement => (
                <TouchableOpacity
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    { backgroundColor: colors.card }
                  ]}
                  onPress={() => handleAchievementPress(achievement)}
                  activeOpacity={0.8}
                >
                  <View style={styles.achievementImageContainer}>
                    <Image
                      source={{ uri: achievement.icon }}
                      style={[
                        styles.achievementImage,
                        !achievement.unlocked && styles.achievementImageLocked
                      ]}
                    />
                    {!achievement.unlocked && (
                      <View style={styles.lockOverlay}>
                        <Lock size={24} color="white" />
                      </View>
                    )}
                    <View 
                      style={[
                        styles.achievementProgress,
                        { backgroundColor: colors.background }
                      ]}
                    >
                      <View 
                        style={[
                          styles.achievementProgressFill,
                          { 
                            backgroundColor: colors.primary,
                            width: `${achievement.progress * 100}%`
                          }
                        ]}
                      />
                    </View>
                  </View>
                  
                  <Text 
                    style={[
                      styles.achievementTitle, 
                      { 
                        color: achievement.unlocked ? colors.text : colors.subtext 
                      }
                    ]}
                    numberOfLines={1}
                  >
                    {achievement.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Achievement Details Modal */}
      {showDetails && selectedAchievement && (
        <Animated.View 
          style={[
            styles.detailsOverlay,
            {
              opacity: detailsAnim
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.detailsBackground}
            onPress={closeDetails}
            activeOpacity={1}
          />
          
          <Animated.View 
            style={[
              styles.detailsCard,
              { 
                backgroundColor: colors.background,
                transform: [
                  {
                    translateY: detailsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <Image
              source={{ uri: selectedAchievement.icon }}
              style={[
                styles.detailsImage,
                !selectedAchievement.unlocked && styles.detailsImageLocked
              ]}
            />
            
            <View style={styles.detailsContent}>
              <Text style={[styles.detailsTitle, { color: colors.text }]}>
                {selectedAchievement.title}
              </Text>
              
              <Text style={[styles.detailsDescription, { color: colors.subtext }]}>
                {selectedAchievement.description}
              </Text>
              
              <View style={styles.detailsProgressContainer}>
                <View style={[styles.detailsProgressBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.detailsProgressFill, 
                      { 
                        backgroundColor: colors.primary,
                        width: `${selectedAchievement.progress * 100}%`
                      }
                    ]} 
                  />
                </View>
                
                <Text style={[styles.detailsProgressText, { color: colors.text }]}>
                  {selectedAchievement.unlocked 
                    ? 'Completed!' 
                    : `Progress: ${Math.round(selectedAchievement.progress * 100)}%`}
                </Text>
              </View>
              
              {!selectedAchievement.unlocked && (
                <View style={[styles.tipContainer, { backgroundColor: colors.card }]}>
                  <Info size={16} color={colors.primary} style={styles.tipIcon} />
                  <Text style={[styles.tipText, { color: colors.text }]}>
                    {selectedAchievement.type === 'saved' && 'Save more date ideas to unlock this achievement.'}
                    {selectedAchievement.type === 'rated' && 'Rate more date ideas to unlock this achievement.'}
                    {selectedAchievement.type === 'completed' && 'Complete more dates to unlock this achievement.'}
                    {selectedAchievement.type === 'submitted' && 'Submit your own date ideas to unlock this achievement.'}
                    {selectedAchievement.type === 'vibes' && 'Try date ideas with different vibes to unlock this achievement.'}
                  </Text>
                </View>
              )}
              
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.primary }]}
                onPress={closeDetails}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsCard: {
    borderRadius: 16,
    padding: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  achievementImageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  achievementImage: {
    width: '100%',
    height: '100%',
  },
  achievementImageLocked: {
    opacity: 0.5,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  achievementProgressFill: {
    height: '100%',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 12,
    textAlign: 'center',
  },
  detailsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  detailsBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  detailsCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  detailsImage: {
    width: '100%',
    height: 200,
  },
  detailsImageLocked: {
    opacity: 0.5,
  },
  detailsContent: {
    padding: 20,
    paddingBottom: 40,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  detailsDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsProgressContainer: {
    marginBottom: 20,
  },
  detailsProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  detailsProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  detailsProgressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  closeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
