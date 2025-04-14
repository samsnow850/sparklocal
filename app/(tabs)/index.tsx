import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  Platform, 
  Dimensions, 
  ActivityIndicator,
  RefreshControl,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  MessageSquare
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { DateIdeaCard } from '@/components/DateIdeaCard';
import { DateIdeaDetail } from '@/components/DateIdeaDetail';
import { SurpriseMe } from '@/components/SurpriseMe';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { DateIdea } from '@/types';
import { getDateOfTheDay } from '@/mocks/dateIdeas';
import { fetchWeather } from '@/utils/weather';
import { router } from 'expo-router';
import { WelcomeOverlay } from '@/components/WelcomeOverlay';
import { useAppContext } from '@/context/AppContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, isDark, activeTheme } = useTheme();
  const { dateIdeas, setCurrentWeather, savedDateIdeas, currentWeather } = useAppStore();
  const { user } = useAuthStore();
  const { t } = useAppContext();
  
  const [selectedDateIdea, setSelectedDateIdea] = useState<DateIdea | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSurpriseModal, setShowSurpriseModal] = useState(false);
  const [dateOfTheDay, setDateOfTheDay] = useState<DateIdea | null>(null);
  const [featuredDateIdeas, setFeaturedDateIdeas] = useState<DateIdea[]>([]);
  const [outdoorDateIdeas, setOutdoorDateIdeas] = useState<DateIdea[]>([]);
  const [allDateIdeas, setAllDateIdeas] = useState<DateIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(!user);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  const loadData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Set date of the day
      setDateOfTheDay(getDateOfTheDay());
      
      // Set featured date ideas (first 5)
      setFeaturedDateIdeas(dateIdeas.slice(0, 5));
      
      // Set outdoor date ideas (filter by weather suitability)
      const outdoor = dateIdeas.filter(idea => 
        idea.weatherSuitability.includes('Sunny') || 
        idea.weatherSuitability.includes('Any')
      );
      setOutdoorDateIdeas(outdoor.slice(0, 5));
      
      // Set all date ideas
      setAllDateIdeas([...dateIdeas]);
      
      // Fetch weather data (except on web)
      if (Platform.OS !== 'web') {
        try {
          const weather = await fetchWeather();
          if (weather) {
            setCurrentWeather(weather);
          }
        } catch (error) {
          console.error('Error fetching weather:', error);
        }
      }
      
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start();
      
      // Simulate loading for a better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  }, [dateIdeas, setCurrentWeather, fadeAnim, translateY]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const handleDateIdeaPress = (dateIdea: DateIdea) => {
    setSelectedDateIdea(dateIdea);
    setShowDetailModal(true);
  };
  
  const handleSurprisePress = () => {
    setShowSurpriseModal(true);
  };
  
  const handleSurpriseSelect = (dateIdea: DateIdea) => {
    setShowSurpriseModal(false);
    setSelectedDateIdea(dateIdea);
    setShowDetailModal(true);
  };
  
  const handleSeeAllPress = (category: string) => {
    // Navigate to a category-specific screen
    router.push({
      pathname: '/category',
      params: { category }
    });
  };
  
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };
  
  const navigateToChat = () => {
    router.push('/chat');
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, [loadData]);
  
  const renderSectionHeader = (title: string, subtitle: string, category: string) => (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.subtext }]}>{subtitle}</Text>
      </View>
      <TouchableOpacity 
        style={styles.seeAllButton}
        onPress={() => handleSeeAllPress(category)}
      >
        <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
        <ArrowRight size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
  
  const renderFeaturedItem = ({ item }: { item: DateIdea }) => (
    <TouchableOpacity 
      style={styles.featuredItem}
      onPress={() => handleDateIdeaPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.featuredImage}
        contentFit="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.featuredGradient}
      />
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <View style={styles.featuredLocation}>
          <MapPin size={12} color="white" />
          <Text style={styles.featuredLocationText}>{item.location}</Text>
        </View>
        {savedDateIdeas.includes(item.id) && (
          <View style={styles.savedBadge}>
            <Text style={styles.savedText}>Saved</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  
  const renderDateIdeaItem = ({ item }: { item: DateIdea }) => (
    <DateIdeaCard 
      dateIdea={item} 
      onPress={handleDateIdeaPress} 
      showWeather={false} 
    />
  );
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80' }}
          style={styles.loadingLogo}
        />
        <Text style={[styles.loadingText, { color: colors.text }]}>SparkLocal</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loadingSpinner} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Animated.View 
        style={[
          styles.welcomeBox, 
          { 
            backgroundColor: colors.card,
            opacity: fadeAnim,
            transform: [{ translateY: translateY }]
          }
        ]}
      >
        <Text style={[styles.welcomeText, { color: colors.subtext }]}>
          {user ? `Welcome back, ${user.displayName || 'user'}!` : 'Welcome to'}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>SparkLocal</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Discover local date ideas in SF</Text>
      </Animated.View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={[styles.surpriseButton, { backgroundColor: colors.primary }]}
          onPress={handleSurprisePress}
        >
          <Sparkles size={20} color="white" />
          <Text style={styles.surpriseButtonText}>Surprise Me</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.chatButton, { backgroundColor: colors.secondary }]}
          onPress={navigateToChat}
        >
          <MessageSquare size={20} color="white" />
          <Text style={styles.chatButtonText}>Ask Assistant</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={allDateIdeas}
        keyExtractor={(item) => item.id}
        renderItem={renderDateIdeaItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            {dateOfTheDay && (
              <>
                <View style={styles.dateOfDayHeader}>
                  <View style={styles.dateOfDayTitleContainer}>
                    <Calendar size={18} color={colors.primary} />
                    <Text style={[styles.dateOfDayTitle, { color: colors.text }]}>Date of the Day</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.dateOfDayCard}
                  onPress={() => handleDateIdeaPress(dateOfTheDay)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: dateOfTheDay.imageUrl }}
                    style={styles.dateOfDayImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.dateOfDayGradient}
                  />
                  <View style={styles.dateOfDayContent}>
                    <Text style={styles.dateOfDayCardTitle}>{dateOfTheDay.title}</Text>
                    <View style={styles.dateOfDayLocation}>
                      <MapPin size={14} color="white" />
                      <Text style={styles.dateOfDayLocationText}>{dateOfTheDay.location}</Text>
                    </View>
                    <Text style={styles.dateOfDayDescription} numberOfLines={2}>
                      {dateOfTheDay.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
            
            {renderSectionHeader('Featured Ideas', 'Popular date spots in San Francisco', 'featured')}
            
            <FlatList
              data={featuredDateIdeas}
              keyExtractor={(item) => `featured-${item.id}`}
              renderItem={renderFeaturedItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
            
            {renderSectionHeader('Perfect for Sunny Days', 'Enjoy the great outdoors', 'outdoor')}
            
            <FlatList
              data={outdoorDateIdeas}
              keyExtractor={(item) => `outdoor-${item.id}`}
              renderItem={renderFeaturedItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
            
            <View style={styles.allIdeasHeader}>
              <Text style={[styles.allIdeasTitle, { color: colors.text }]}>All Date Ideas</Text>
            </View>
          </>
        }
      />
      
      {/* Date Idea Detail Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetailModal(false)}
      >
        {selectedDateIdea && (
          <DateIdeaDetail 
            dateIdea={selectedDateIdea} 
            onClose={() => setShowDetailModal(false)} 
          />
        )}
      </Modal>
      
      {/* Surprise Me Modal */}
      <SurpriseMe
        visible={showSurpriseModal}
        onClose={() => setShowSurpriseModal(false)}
        onSelect={handleSurpriseSelect}
      />
      
      {/* Welcome Overlay */}
      <WelcomeOverlay 
        visible={showWelcome} 
        onComplete={handleWelcomeComplete} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  loadingSpinner: {
    marginTop: 24,
  },
  welcomeBox: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
  },
  surpriseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
  },
  surpriseButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
  },
  chatButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  dateOfDayHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  dateOfDayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateOfDayTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
  dateOfDayCard: {
    marginHorizontal: 20,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  dateOfDayImage: {
    width: '100%',
    height: '100%',
  },
  dateOfDayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  dateOfDayContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  dateOfDayCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  dateOfDayLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateOfDayLocationText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 4,
  },
  dateOfDayDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 24,
  },
  featuredItem: {
    width: width * 0.6,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredLocationText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  savedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  savedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  allIdeasHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  allIdeasTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 20,
  },
});
