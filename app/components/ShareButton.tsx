import React from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  Share, 
  Platform,
  Alert
} from 'react-native';
import { Share2 } from 'lucide-react-native';
import { DateIdea } from '@/types';
import { useTheme } from '@/utils/theme';

interface ShareButtonProps {
  dateIdea: DateIdea;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ dateIdea }) => {
  const { colors } = useTheme();
  
  const handleShare = async () => {
    try {
      // Create share message
      const message = `Check out this date idea: ${dateIdea.title}\n\n${dateIdea.description}\n\nLocation: ${dateIdea.location}\n\nShared via SparkLocal`;
      
      // Use Share API
      if (Platform.OS === 'web') {
        // Web implementation using Navigator.share API
        if (navigator.share) {
          try {
            await navigator.share({
              title: `SparkLocal: ${dateIdea.title}`,
              text: message,
              url: 'https://samuelesnow.co'
            });
          } catch (error: any) {
            // Handle errors from share API
            if (error.name !== 'AbortError') {
              Alert.alert('Error sharing', 'Could not share this date idea. Try again later.');
            }
          }
        } else {
          // Fallback for browsers that don't support share API
          Alert.alert(
            'Share',
            'Copy this text to share:',
            [
              {
                text: 'Copy',
                onPress: () => {
                  // In a real app, we would use clipboard API here
                  Alert.alert('Copied to clipboard!');
                }
              },
              {
                text: 'Cancel',
                style: 'cancel'
              }
            ]
          );
        }
      } else {
        // Native implementation
        const result = await Share.share({
          message,
          title: `SparkLocal: ${dateIdea.title}`
        });
        
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared with activity type of result.activityType
          } else {
            // Shared
          }
        } else if (result.action === Share.dismissedAction) {
          // Dismissed
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while sharing');
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.shareButton, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
      onPress={handleShare}
    >
      <Share2 size={20} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
