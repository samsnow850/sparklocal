import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Clock, DollarSign, Cloud } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DateIdea, WeatherCondition } from '@/types';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { fetchWeather, getWeatherEmoji } from '@/utils/weather';

interface DateIdeaCardProps {
  dateIdea: DateIdea;
  onPress: (dateIdea: DateIdea) => void;
  showWeather?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

export const DateIdeaCard: React.FC<DateIdeaCardProps> = ({ dateIdea, onPress, showWeather = false }) => {
  const { colors } = useTheme();
  const { savedDateIdeas } = useAppStore();
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  
  const isSaved = savedDateIdeas.includes(dateIdea.id);
  
  useEffect(() => {
    if (showWeather && dateIdea.location) {
      const loadWeather = async () => {
        setIsLoadingWeather(true);
        try {
          // Extract city name from location
          const cityName = dateIdea.location.split(',')[0].trim();
          const weatherData = await fetchWeather(cityName);
          if (weatherData) {
            setWeather(weatherData);
          }
        } catch (error) {
          console.error('Error fetching weather for location:', error);
        } finally {
          setIsLoadingWeather(false);
        }
      };
      
      loadWeather();
    }
  }, [dateIdea.location, showWeather]);
  
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card }]} 
      onPress={() => onPress(dateIdea)}
      activeOpacity={0.9}
    >
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
        {isSaved && (
          <View style={[styles.savedBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.savedText}>Saved</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{dateIdea.title}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.subtext} />
          <Text style={[styles.location, { color: colors.subtext }]}>{dateIdea.location}</Text>
        </View>
        
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, { backgroundColor: colors.tag.background }]}>
            <DollarSign size={14} color={colors.tag.text} />
            <Text style={[styles.tagText, { color: colors.tag.text }]}>{dateIdea.price}</Text>
          </View>
          
          <View style={[styles.tag, { backgroundColor: colors.tag.background }]}>
            <Clock size={14} color={colors.tag.text} />
            <Text style={[styles.tagText, { color: colors.tag.text }]}>{dateIdea.duration}</Text>
          </View>
          
          {dateIdea.vibes.slice(0, 1).map((vibe) => (
            <View key={vibe} style={[styles.tag, { backgroundColor: colors.tag.background }]}>
              <Text style={[styles.tagText, { color: colors.tag.text }]}>{vibe}</Text>
            </View>
          ))}
          
          {showWeather && (
            <View style={[styles.weatherTag, { backgroundColor: colors.primary + '20' }]}>
              {isLoadingWeather ? (
                <ActivityIndicator size="small" color={colors.primary} style={styles.weatherLoader} />
              ) : weather ? (
                <>
                  <Cloud size={14} color={colors.primary} />
                  <Text style={[styles.weatherText, { color: colors.primary }]}>
                    {Math.round(weather.temp)}°C {getWeatherEmoji(weather.main)}
                  </Text>
                </>
              ) : (
                <>
                  <Cloud size={14} color={colors.primary} />
                  <Text style={[styles.weatherText, { color: colors.primary }]}>
                    Loading...
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
        
        <Text 
          style={[styles.description, { color: colors.subtext }]}
          numberOfLines={2}
        >
          {dateIdea.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 180,
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
  savedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  savedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
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
    marginBottom: 12,
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
  weatherTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  weatherLoader: {
    marginHorizontal: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});
