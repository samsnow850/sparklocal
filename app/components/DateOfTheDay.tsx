import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Calendar, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DateIdea } from '@/types';
import { useTheme } from '@/utils/theme';

interface DateOfTheDayProps {
  dateIdea: DateIdea;
  onPress: (dateIdea: DateIdea) => void;
}

export const DateOfTheDay: React.FC<DateOfTheDayProps> = ({ dateIdea, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => onPress(dateIdea)}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Calendar size={18} color={colors.primary} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Date of the Day</Text>
        </View>
      </View>
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: dateIdea.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>{dateIdea.title}</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="white" />
            <Text style={styles.location}>{dateIdea.location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    padding: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  imageContainer: {
    height: 160,
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
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: 'white',
    marginLeft: 4,
  },
});
