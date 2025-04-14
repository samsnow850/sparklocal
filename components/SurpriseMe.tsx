import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { Image } from 'expo-image';
import { X, Shuffle, MapPin, Clock, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DateIdea } from '@/types';
import { useTheme } from '@/utils/theme';
import { getRandomDateIdea } from '@/mocks/dateIdeas';
import { useAppStore } from '@/store/useAppStore';

interface SurpriseMeProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (dateIdea: DateIdea) => void;
}

export const SurpriseMe: React.FC<SurpriseMeProps> = ({ visible, onClose, onSelect }) => {
  const { colors } = useTheme();
  const [randomDateIdea, setRandomDateIdea] = useState<DateIdea | null>(null);
  const { currentWeather } = useAppStore();
  
  useEffect(() => {
    if (visible) {
      generateRandomIdea();
    }
  }, [visible]);
  
  const generateRandomIdea = () => {
    // Get a random date idea
    const newIdea = getRandomDateIdea();
    
    // If we have weather data, we could filter based on weather
    // This is a simplified version
    setRandomDateIdea(newIdea);
  };
  
  const handleSelect = () => {
    if (randomDateIdea) {
      onSelect(randomDateIdea);
    }
  };
  
  if (!randomDateIdea) return null;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Surprise Date Idea</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: randomDateIdea.imageUrl }}
              style={styles.image}
              contentFit="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.ideaTitle, { color: colors.text }]}>{randomDateIdea.title}</Text>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.subtext} />
              <Text style={[styles.location, { color: colors.subtext }]}>{randomDateIdea.location}</Text>
            </View>
            
            <View style={styles.tagsContainer}>
              <View style={[styles.tag, { backgroundColor: colors.tag.background }]}>
                <DollarSign size={14} color={colors.tag.text} />
                <Text style={[styles.tagText, { color: colors.tag.text }]}>{randomDateIdea.price}</Text>
              </View>
              
              <View style={[styles.tag, { backgroundColor: colors.tag.background }]}>
                <Clock size={14} color={colors.tag.text} />
                <Text style={[styles.tagText, { color: colors.tag.text }]}>{randomDateIdea.duration}</Text>
              </View>
              
              {randomDateIdea.vibes.slice(0, 1).map((vibe) => (
                <View key={vibe} style={[styles.tag, { backgroundColor: colors.tag.background }]}>
                  <Text style={[styles.tagText, { color: colors.tag.text }]}>{vibe}</Text>
                </View>
              ))}
            </View>
            
            <Text style={[styles.description, { color: colors.text }]}>
              {randomDateIdea.description}
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.shuffleButton, { backgroundColor: colors.secondary }]}
                onPress={generateRandomIdea}
              >
                <Shuffle size={20} color="white" />
                <Text style={styles.buttonText}>Shuffle</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.selectButton, { backgroundColor: colors.primary }]}
                onPress={handleSelect}
              >
                <Text style={styles.buttonText}>Select This Idea</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 30,
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  content: {
    padding: 20,
  },
  ideaTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});
