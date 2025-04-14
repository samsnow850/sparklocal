import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Filter, MapPin } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { DateIdeaCard } from '@/components/DateIdeaCard';
import { DateIdeaDetail } from '@/components/DateIdeaDetail';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { DateIdea, Filter as FilterType } from '@/types';
import { SearchFiltersModal } from '@/components/SearchFiltersModal';
import { Image } from 'expo-image';

export default function CategoryScreen() {
  const { colors, isDark } = useTheme();
  const { dateIdeas } = useAppStore();
  const params = useLocalSearchParams<{ category: string }>();
  const category = params.category || 'featured';
  
  const [filteredIdeas, setFilteredIdeas] = useState<DateIdea[]>([]);
  const [selectedDateIdea, setSelectedDateIdea] = useState<DateIdea | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Filter date ideas based on category
    let filtered: DateIdea[] = [];
    
    switch (category) {
      case 'featured':
        filtered = dateIdeas.slice(0, 10);
        break;
      case 'outdoor':
        filtered = dateIdeas.filter(idea => 
          idea.weatherSuitability.includes('Sunny') || 
          idea.weatherSuitability.includes('Any')
        );
        break;
      case 'romantic':
        filtered = dateIdeas.filter(idea => idea.vibes.includes('Romantic'));
        break;
      case 'adventure':
        filtered = dateIdeas.filter(idea => idea.vibes.includes('Adventurous'));
        break;
      case 'budget':
        filtered = dateIdeas.filter(idea => idea.price === '$');
        break;
      default:
        filtered = dateIdeas;
    }
    
    setFilteredIdeas(filtered);
    
    // Simulate loading for a better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [category, dateIdeas]);
  
  const handleDateIdeaPress = (dateIdea: DateIdea) => {
    setSelectedDateIdea(dateIdea);
    setShowDetailModal(true);
  };
  
  const getCategoryTitle = () => {
    switch (category) {
      case 'featured':
        return 'Featured Ideas';
      case 'outdoor':
        return 'Outdoor Ideas';
      case 'romantic':
        return 'Romantic Ideas';
      case 'adventure':
        return 'Adventure Ideas';
      case 'budget':
        return 'Budget-Friendly Ideas';
      default:
        return 'All Ideas';
    }
  };
  
  const getCategoryDescription = () => {
    switch (category) {
      case 'featured':
        return 'Popular date spots in San Francisco';
      case 'outdoor':
        return 'Enjoy the great outdoors';
      case 'romantic':
        return 'Perfect for special moments';
      case 'adventure':
        return 'For thrill-seeking couples';
      case 'budget':
        return 'Great dates that won\'t break the bank';
      default:
        return 'Discover local date ideas';
    }
  };
  
  const goBack = () => {
    router.back();
  };
  
  const handleApplyFilters = (filters: FilterType) => {
    setIsLoading(true);
    
    // Apply filters to the category results
    let filtered = dateIdeas;
    
    // First filter by category
    switch (category) {
      case 'featured':
        filtered = dateIdeas.slice(0, 10);
        break;
      case 'outdoor':
        filtered = dateIdeas.filter(idea => 
          idea.weatherSuitability.includes('Sunny') || 
          idea.weatherSuitability.includes('Any')
        );
        break;
      case 'romantic':
        filtered = dateIdeas.filter(idea => idea.vibes.includes('Romantic'));
        break;
      case 'adventure':
        filtered = dateIdeas.filter(idea => idea.vibes.includes('Adventurous'));
        break;
      case 'budget':
        filtered = dateIdeas.filter(idea => idea.price === '$');
        break;
      default:
        filtered = dateIdeas;
    }
    
    // Then apply additional filters
    if (filters.price && filters.price.length > 0) {
      filtered = filtered.filter(idea => filters.price?.includes(idea.price));
    }
    
    if (filters.duration && filters.duration.length > 0) {
      filtered = filtered.filter(idea => filters.duration?.includes(idea.duration));
    }
    
    if (filters.vibes && filters.vibes.length > 0) {
      filtered = filtered.filter(idea => 
        idea.vibes.some(vibe => filters.vibes?.includes(vibe))
      );
    }
    
    setFilteredIdeas(filtered);
    
    // Simulate loading for a better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{getCategoryTitle()}</Text>
          <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>{getCategoryDescription()}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.card }]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {filteredIdeas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80' }}
            style={styles.emptyImage}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No results found</Text>
          <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
            Try adjusting your filters or explore other categories
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredIdeas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DateIdeaCard dateIdea={item} onPress={handleDateIdeaPress} showWeather={true} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <Text style={[styles.resultsText, { color: colors.text }]}>
                {filteredIdeas.length} {filteredIdeas.length === 1 ? 'result' : 'results'}
              </Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.primary} />
                <Text style={[styles.locationText, { color: colors.primary }]}>San Francisco</Text>
              </View>
            </View>
          }
        />
      )}
      
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
      
      {/* Filters Modal */}
      <SearchFiltersModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
