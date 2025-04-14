import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { DateIdeaCard } from '@/components/DateIdeaCard';
import { DateIdeaDetail } from '@/components/DateIdeaDetail';
import { SearchFiltersModal } from '@/components/SearchFiltersModal';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { DateIdea } from '@/types';

export default function SearchScreen() {
  const { colors, isDark } = useTheme();
  const { dateIdeas, searchFilters, updateSearchFilters } = useAppStore();
  const [filteredDateIdeas, setFilteredDateIdeas] = useState<DateIdea[]>([]);
  const [selectedDateIdea, setSelectedDateIdea] = useState<DateIdea | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  
  useEffect(() => {
    filterDateIdeas();
  }, [dateIdeas, searchFilters]);
  
  const filterDateIdeas = () => {
    let filtered = [...dateIdeas];
    
    // Filter by search query
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.title.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
      );
    }
    
    // Filter by location
    if (searchFilters.location) {
      const location = searchFilters.location.toLowerCase();
      filtered = filtered.filter(
        item => item.location.toLowerCase().includes(location)
      );
    }
    
    // Filter by price
    if (searchFilters.price.length > 0) {
      filtered = filtered.filter(
        item => searchFilters.price.includes(item.price)
      );
    }
    
    // Filter by duration
    if (searchFilters.duration.length > 0) {
      filtered = filtered.filter(
        item => searchFilters.duration.includes(item.duration)
      );
    }
    
    // Filter by vibes
    if (searchFilters.vibes.length > 0) {
      filtered = filtered.filter(
        item => item.vibes.some(vibe => searchFilters.vibes.includes(vibe))
      );
    }
    
    setFilteredDateIdeas(filtered);
  };
  
  const handleDateIdeaPress = (dateIdea: DateIdea) => {
    setSelectedDateIdea(dateIdea);
    setShowDetailModal(true);
  };
  
  const handleSearchChange = (text: string) => {
    updateSearchFilters({ query: text });
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Search size={50} color={colors.subtext} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No results found</Text>
      <Text style={[styles.emptySubtitle, { color: colors.subtext }]}>
        Try adjusting your search or filters
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Search</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Find the perfect date idea</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.subtext} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by name, description, or location"
            placeholderTextColor={colors.subtext}
            value={searchFilters.query}
            onChangeText={handleSearchChange}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowFiltersModal(true)}
        >
          <Filter size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Active filters display */}
      {(searchFilters.price.length > 0 || 
        searchFilters.duration.length > 0 || 
        searchFilters.vibes.length > 0) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={[styles.activeFiltersTitle, { color: colors.text }]}>
            Active Filters:
          </Text>
          <View style={styles.filtersRow}>
            {searchFilters.price.map(price => (
              <View 
                key={`price-${price}`} 
                style={[styles.filterTag, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.filterTagText}>{price}</Text>
              </View>
            ))}
            
            {searchFilters.duration.map(duration => (
              <View 
                key={`duration-${duration}`} 
                style={[styles.filterTag, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.filterTagText}>{duration}</Text>
              </View>
            ))}
            
            {searchFilters.vibes.map(vibe => (
              <View 
                key={`vibe-${vibe}`} 
                style={[styles.filterTag, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.filterTagText}>{vibe}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Map View (simplified) */}
      {searchFilters.mapView ? (
        <View style={[styles.mapContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.mapPlaceholder, { color: colors.text }]}>
            Map View
          </Text>
          <MapPin size={50} color={colors.primary} />
          <Text style={[styles.mapSubtext, { color: colors.subtext }]}>
            Map integration would be shown here
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredDateIdeas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DateIdeaCard dateIdea={item} onPress={handleDateIdeaPress} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
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
        visible={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  mapSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
