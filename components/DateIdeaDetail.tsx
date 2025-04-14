import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking, Platform, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { X, MapPin, Clock, DollarSign, ExternalLink, Star, Cloud, Navigation } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DateIdea, WeatherCondition } from '@/types';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { ShareButton } from './ShareButton';
import { DateFeedbackModal } from './DateFeedbackModal';
import { fetchWeather, getWeatherEmoji, getWeatherIcon } from '@/utils/weather';

interface DateIdeaDetailProps {
  dateIdea: DateIdea;
  onClose: () => void;
}

export const DateIdeaDetail: React.FC<DateIdeaDetailProps> = ({ dateIdea, onClose }) => {
  const { colors } = useTheme();
  const { 
    savedDateIdeas, 
    dateRatings,
    saveDateIdea, 
    unsaveDateIdea, 
    rateDateIdea
  } = useAppStore();
  
  const isSaved = savedDateIdeas.includes(dateIdea.id);
  const currentRating = dateRatings[dateIdea.id] || 0;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [weather, setWeather] = useState<WeatherCondition | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  
  useEffect(() => {
    const loadWeather = async () => {
      if (dateIdea.location) {
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
      }
    };
    
    loadWeather();
  }, [dateIdea.location]);
  
  const handleSaveToggle = () => {
    if (isSaved) {
      unsaveDateIdea(dateIdea.id);
    } else {
      saveDateIdea(dateIdea.id);
    }
  };
  
  const handleExternalLink = async () => {
    if (dateIdea.externalLink) {
      const canOpen = await Linking.canOpenURL(dateIdea.externalLink);
      if (canOpen) {
        await Linking.openURL(dateIdea.externalLink);
      }
    }
  };
  
  const handleRating = (rating: number) => {
    rateDateIdea(dateIdea.id, rating);
  };
  
  const handleCompletedDate = () => {
    setShowFeedbackModal(true);
  };
  
  const handleOpenMaps = async () => {
    if (dateIdea.coordinates) {
      const { latitude, longitude } = dateIdea.coordinates;
      const url = Platform.select({
        ios: `maps:0,0?q=${dateIdea.location}@${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}(${dateIdea.location})`,
        web: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      });
      
      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        }
      }
    } else {
      // If no coordinates, try to open maps with just the location name
      const encodedLocation = encodeURIComponent(dateIdea.location);
      const url = Platform.select({
        ios: `maps:0,0?q=${encodedLocation}`,
        android: `geo:0,0?q=${encodedLocation}`,
        web: `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
      });
      
      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        }
      }
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: dateIdea.imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent']}
            style={styles.topGradient}
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.shareButtonContainer}>
            <ShareButton dateIdea={dateIdea} />
          </View>
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{dateIdea.title}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={18} color={colors.subtext} />
            <Text style={[styles.location, { color: colors.subtext }]}>{dateIdea.location}</Text>
          </View>
          
          {/* Weather Information */}
          <View style={[styles.weatherContainer, { backgroundColor: colors.card }]}>
            {isLoadingWeather ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : weather ? (
              <>
                <View style={styles.weatherHeader}>
                  <Cloud size={20} color={colors.primary} />
                  <Text style={[styles.weatherTitle, { color: colors.text }]}>Current Weather</Text>
                </View>
                <View style={styles.weatherContent}>
                  <View style={styles.weatherMain}>
                    <Text style={[styles.weatherTemp, { color: colors.text }]}>
                      {Math.round(weather.temp)}°C
                    </Text>
                    <Text style={[styles.weatherEmoji, { color: colors.text }]}>
                      {getWeatherEmoji(weather.main)}
                    </Text>
                  </View>
                  <Text style={[styles.weatherDescription, { color: colors.subtext }]}>
                    {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={[styles.weatherUnavailable, { color: colors.subtext }]}>
                Weather information unavailable
              </Text>
            )}
          </View>
          
          <View style={styles.tagsContainer}>
            <View style={[styles.tag, { backgroundColor: colors.tag.background }]}>
              <DollarSign size={16} color={colors.tag.text} />
              <Text style={[styles.tagText, { color: colors.tag.text }]}>{dateIdea.price}</Text>
            </View>
            
            <View style={[styles.tag, { backgroundColor: colors.tag.background }]}>
              <Clock size={16} color={colors.tag.text} />
              <Text style={[styles.tagText, { color: colors.tag.text }]}>{dateIdea.duration}</Text>
            </View>
          </View>
          
          <View style={styles.vibesContainer}>
            {dateIdea.vibes.map((vibe) => (
              <View key={vibe} style={[styles.vibeTag, { backgroundColor: colors.tag.background }]}>
                <Text style={[styles.vibeText, { color: colors.tag.text }]}>{vibe}</Text>
              </View>
            ))}
          </View>
          
          <Text style={[styles.description, { color: colors.text }]}>
            {dateIdea.description}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Text style={[styles.ratingTitle, { color: colors.text }]}>Rate this date idea:</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRating(star)}
                  style={styles.starButton}
                >
                  <Star
                    size={28}
                    color={colors.primary}
                    fill={star <= currentRating ? colors.primary : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: isSaved ? colors.secondary : colors.primary }
              ]}
              onPress={handleSaveToggle}
            >
              <Text style={styles.actionButtonText}>
                {isSaved ? 'Remove from Saved' : 'Save for Later'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.primary }
              ]}
              onPress={handleCompletedDate}
            >
              <Text style={styles.actionButtonText}>I Completed This Date!</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.secondary }
              ]}
              onPress={handleOpenMaps}
            >
              <Text style={styles.actionButtonText}>Open in Maps</Text>
              <Navigation size={18} color="white" style={styles.actionIcon} />
            </TouchableOpacity>
            
            {dateIdea.externalLink && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.secondary }
                ]}
                onPress={handleExternalLink}
              >
                <Text style={styles.actionButtonText}>Visit Website</Text>
                <ExternalLink size={18} color="white" style={styles.actionIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
      
      <DateFeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        dateIdea={dateIdea}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  shareButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 16,
    marginLeft: 6,
  },
  weatherContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: '700',
    marginRight: 8,
  },
  weatherEmoji: {
    fontSize: 24,
  },
  weatherDescription: {
    fontSize: 14,
  },
  weatherUnavailable: {
    fontSize: 14,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  tagText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '500',
  },
  vibesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  vibeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  vibeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 8,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  actionIcon: {
    marginLeft: 8,
  },
});
