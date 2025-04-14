import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  Dimensions, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Heart, 
  Grid, 
  List, 
  Filter, 
  Search, 
  X,
  MapPin
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { DateIdeaCard } from '@/components/DateIdeaCard';
import { DateIdeaDetail } from '@/components/DateIdeaDetail';
import { SearchFiltersModal } from '@/components/SearchFiltersModal';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { DateIdea } from '@/types';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const GRID_COLUMNS = 2;
const GRID_ITEM_WIDTH = (width - 48) / GRID_COLUMNS;

export default function SavedScreen() {
  const { colors, isDark } = useTheme();
  const { dateIdeas, savedDateIdeas } = useAppStore();
  
  const [savedItems, setSavedItems] = useState<DateIdea[]>([]);
  const [selectedDateIdea, setSelectedDateIdea] = useState<DateIdea | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Generate a unique key for FlatList based on view mode
  const listKey = isGridView ? 'grid' : 'list';
  
  const loadSavedItems = useCallback(() => {
    setIsLoading(true);
    
    // Filter date ideas based on saved IDs
    const items = dateIdeas.filter(idea => savedDateIdeas.includes(idea.id));
    
    // Apply search filter if query exists
    const filteredItems = searchQuery
      ? items.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.vibes.some(vibe => vibe.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : items;
    
    setSavedItems(filteredItems);
    
    // Simulate loading for a better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [dateIdeas, savedDateIdeas, searchQuery]);
  
  useEffect(() => {
    loadSavedItems();
  }, [loadSavedItems]);
  
  const handleDateIdeaPress = (dateIdea: DateIdea) => {
    setSelectedDateIdea(dateIdea);
    setShowDetailModal(true);
  };
  
  const toggleViewMode = () => {
    setIsGridView(!isGridView);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilterPress = () => {
    setShowFilters(true);
  };
  
  const handleFilterClose = () => {
    setShowFilters(false);
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSavedItems();
    setRefreshing(false);
  }, [loadSavedItems]);
  
  const renderGridItem = ({ item }: { item: DateIdea }) => (
    <TouchableOpacity 
      style={[styles.gridItem, { backgroundColor: colors.card }]}
      onPress={() => handleDateIdeaPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.gridImageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.gridImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gridGradient}
        />
      </View>
      <View style={styles.gridContent}>
        <Text 
          style={[styles.gridTitle, { color: colors.text }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <View style={styles.gridLocation}>
          <MapPin size={12} color={colors.subtext} />
          <Text 
            style={[styles.gridLocationText, { color: colors.subtext }]}
            numberOfLines={1}
          >
            {item.location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Heart size={60} color={colors.primary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Date Ideas</Text>
      <Text style={[styles.emptyDescription, { color: colors.subtext }]}>
        Save your favorite date ideas to access them quickly later.
      </Text>
      <TouchableOpacity
        style={[styles.exploreButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.exploreButtonText}>Explore Date Ideas</Text>
      </TouchableOpacity>
    </View>
  );
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Saved</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Saved</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.viewModeButton, { backgroundColor: colors.card }]}
            onPress={toggleViewMode}
          >
            {isGridView ? (
              <List size={20} color={colors.text} />
            ) : (
              <Grid size={20} color={colors.text} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: colors.card }]}
            onPress={handleFilterPress}
          >
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Search size={20} color={colors.subtext} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search saved ideas..."
          placeholderTextColor={colors.subtext}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <X size={20} color={colors.subtext} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {savedItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          key={listKey}
          data={savedItems}
          keyExtractor={(item) => item.id}
          renderItem={isGridView ? renderGridItem : ({ item }) => (
            <DateIdeaCard dateIdea={item} onPress={handleDateIdeaPress} showWeather={true} />
          )}
          numColumns={isGridView ? GRID_COLUMNS : 1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            isGridView && styles.gridContent,
            savedItems.length === 0 && styles.emptyListContent
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
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
      
      {/* Search Filters Modal */}
      <SearchFiltersModal
        visible={showFilters}
        onClose={handleFilterClose}
        onApply={() => {
          // This would apply filters in a real app
          handleFilterClose();
        }}
      />
    </SafeAreaView>
  );
}

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridContent: {
    paddingHorizontal: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    width: GRID_ITEM_WIDTH,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  gridImageContainer: {
    height: 120,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },
  gridContent: {
    padding: 10,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  gridLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLocationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
