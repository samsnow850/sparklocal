import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  Platform
} from 'react-native';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface WelcomeOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ visible, onComplete }) => {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to SparkLocal 2.1",
      description: "Discover amazing date ideas in your local area and create unforgettable memories.",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "What's New in 2.1",
      description: "• Customizable themes (Sunset, Midnight, Neon, and more)\n• Enhanced safety features\n• Improved homepage with better date idea loading\n• Weather integration for better recommendations\n• Notification system for settings changes",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Your Safety Matters",
      description: "• Always meet in public places\n• Share your location with trusted friends\n• Research venues before visiting\n• Trust your instincts\n• Use our safety check-in feature",
      image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  const handleSignIn = () => {
    onComplete();
    router.push('/login');
  };
  
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
    >
      <View style={[styles.container, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <Image
            source={{ uri: steps[currentStep].image }}
            style={styles.image}
            resizeMode="cover"
          />
          
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.text }]}>
              {steps[currentStep].title}
            </Text>
            
            <Text style={[styles.description, { color: colors.subtext }]}>
              {steps[currentStep].description}
            </Text>
            
            <View style={styles.dotsContainer}>
              {steps.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.dot, 
                    { 
                      backgroundColor: index === currentStep 
                        ? colors.primary 
                        : colors.border 
                    }
                  ]} 
                />
              ))}
            </View>
            
            <View style={styles.buttonsContainer}>
              {currentStep < steps.length - 1 ? (
                <>
                  <TouchableOpacity
                    style={[styles.skipButton, { borderColor: colors.border }]}
                    onPress={handleSkip}
                  >
                    <Text style={[styles.skipButtonText, { color: colors.text }]}>
                      Skip
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: colors.primary }]}
                    onPress={handleNext}
                  >
                    <Text style={styles.nextButtonText}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.signInButton, { borderColor: colors.primary }]}
                    onPress={handleSignIn}
                  >
                    <Text style={[styles.signInButtonText, { color: colors.primary }]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.getStartedButton, { backgroundColor: colors.primary }]}
                    onPress={handleSkip}
                  >
                    <Text style={styles.getStartedButtonText}>
                      Get Started
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  getStartedButton: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
