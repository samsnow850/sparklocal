import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Alert
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { SearchFilters } from '@/types';

interface SearchFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (filters: SearchFilters) => void;
}

export const SearchFiltersModal: React.FC<SearchFiltersModalProps> = ({ 
  visible, 
  onClose,
  onApply
}) => {
  const { colors } = useTheme();
  const { searchFilters, updateSearchFilters } = useAppStore();
  
  const [filters, setFilters] = useState<SearchFilters>({
    ...searchFilters
  });
  
  const priceOptions = ['$', '$$', '$$$', '$$$$'];
  const durationOptions = ['< 1 hour', '1-2 hours', '2-4 hours', 'Half day', 'Full day'];
  const vibeOptions = [
    'Romantic', 'Adventurous', 'Relaxing', 'Cultural', 'Foodie', 
    'Outdoorsy', 'Creative', 'Educational', 'Sporty', 'Luxurious'
  ];
  
  const togglePrice = (price: string) => {
    setFilters(prev => {
      const newPrices = prev.price.includes(price)
        ? prev.price.filter(p => p !== price)
        : [...prev.price, price];
      
      return { ...prev, price: newPrices };
    });
  };
  
  const toggleDuration = (duration: string) => {
    setFilters(prev => {
      const newDurations = prev.duration.includes(duration)
        ? prev.duration.filter(d => d !== duration)
        : [...prev.duration, duration];
      
      return { ...prev, duration: newDurations };
    });
  };
  
  const toggleVibe = (vibe: string) => {
    setFilters(prev => {
      const newVibes = prev.vibes.includes(vibe)
        ? prev.vibes.filter(v => v !== vibe)
        : [...prev.vibes, vibe];
      
      return { ...prev, vibes: newVibes };
    });
  };
  
  const handleReset = () => {
    setFilters({
      query: '',
      location: '',
      price: [],
      duration: [],
      vibes: [],
      mapView: false,
    });
  };
  
  const handleApply = () => {
    updateSearchFilters(filters);
    
    if (onApply) {
      onApply(filters);
    } else {
      // If onApply is not provided, just show a notification
      Alert.alert('Filters Applied', 'Your search filters have been updated.');
    }
    
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Price</Text>
            <View style={styles.optionsContainer}>
              {priceOptions.map(price => (
                <TouchableOpacity
                  key={price}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: filters.price.includes(price) ? colors.primary : colors.card,
                      borderColor: filters.price.includes(price) ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => togglePrice(price)}
                >
                  <Text 
                    style={[
                      styles.optionText, 
                      { color: filters.price.includes(price) ? 'white' : colors.text }
                    ]}
                  >
                    {price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Duration</Text>
            <View style={styles.optionsContainer}>
              {durationOptions.map(duration => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: filters.duration.includes(duration) ? colors.primary : colors.card,
                      borderColor: filters.duration.includes(duration) ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => toggleDuration(duration)}
                >
                  <Text 
                    style={[
                      styles.optionText, 
                      { color: filters.duration.includes(duration) ? 'white' : colors.text }
                    ]}
                  >
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Vibes</Text>
            <View style={styles.optionsContainer}>
              {vibeOptions.map(vibe => (
                <TouchableOpacity
                  key={vibe}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: filters.vibes.includes(vibe) ? colors.primary : colors.card,
                      borderColor: filters.vibes.includes(vibe) ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => toggleVibe(vibe)}
                >
                  <Text 
                    style={[
                      styles.optionText, 
                      { color: filters.vibes.includes(vibe) ? 'white' : colors.text }
                    ]}
                  >
                    {vibe}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: colors.border }]}
              onPress={handleReset}
            >
              <Text style={[styles.resetButtonText, { color: colors.text }]}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
              <Check size={20} color="white" style={styles.applyIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  resetButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  applyIcon: {
    marginLeft: 8,
  },
});
