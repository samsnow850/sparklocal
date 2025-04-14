import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { router } from 'expo-router';
import ConfettiCannon from '@/components/ConfettiCannon';

const { width } = Dimensions.get('window');

// Define personality types
type PersonalityType = 'Adventurer' | 'Romantic' | 'Creative' | 'Foodie' | 'Intellectual';

interface PersonalityResult {
  type: PersonalityType;
  description: string;
  imageUrl: string;
  dateIdeas: string[];
}

// Questions for the test
const questions = [
  {
    id: 1,
    text: "Your ideal weekend activity would be:",
    options: [
      { text: "Hiking a new trail or outdoor adventure", personality: "Adventurer" },
      { text: "A candlelit dinner with soft music", personality: "Romantic" },
      { text: "Visiting an art gallery or making something together", personality: "Creative" },
      { text: "Trying a new restaurant or cooking class", personality: "Foodie" },
      { text: "Attending a lecture or discussing a book", personality: "Intellectual" }
    ]
  },
  {
    id: 2,
    text: "When planning a date, you prioritize:",
    options: [
      { text: "Excitement and new experiences", personality: "Adventurer" },
      { text: "Intimate atmosphere and connection", personality: "Romantic" },
      { text: "Aesthetic appeal and artistic elements", personality: "Creative" },
      { text: "Quality of food and drinks", personality: "Foodie" },
      { text: "Learning something new together", personality: "Intellectual" }
    ]
  },
  {
    id: 3,
    text: "Your go-to gift for someone special would be:",
    options: [
      { text: "Tickets to an experience or event", personality: "Adventurer" },
      { text: "Personalized, sentimental item", personality: "Romantic" },
      { text: "Something handmade or artistic", personality: "Creative" },
      { text: "Gourmet food basket or cooking tools", personality: "Foodie" },
      { text: "Books or something that expands their mind", personality: "Intellectual" }
    ]
  },
  {
    id: 4,
    text: "Your ideal vacation would be:",
    options: [
      { text: "Backpacking or exploring off the beaten path", personality: "Adventurer" },
      { text: "A secluded beach or cozy cabin getaway", personality: "Romantic" },
      { text: "A city known for its art and architecture", personality: "Creative" },
      { text: "A region famous for its cuisine", personality: "Foodie" },
      { text: "A historical site or educational tour", personality: "Intellectual" }
    ]
  },
  {
    id: 5,
    text: "In a relationship, you value most:",
    options: [
      { text: "Spontaneity and trying new things together", personality: "Adventurer" },
      { text: "Deep emotional connection and affection", personality: "Romantic" },
      { text: "Sharing creative expression and aesthetics", personality: "Creative" },
      { text: "Enjoying culinary experiences together", personality: "Foodie" },
      { text: "Stimulating conversations and growth", personality: "Intellectual" }
    ]
  }
];

// Personality results
const personalityResults: Record<PersonalityType, PersonalityResult> = {
  Adventurer: {
    type: "Adventurer",
    description: "You thrive on excitement and new experiences! Your ideal dates involve exploration, physical activity, and stepping outside comfort zones. You value creating memories through shared adventures.",
    imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    dateIdeas: [
      "Rock climbing at an indoor gym",
      "Kayaking or paddleboarding",
      "Hiking to a scenic viewpoint",
      "Zip-lining adventure",
      "Bike tour of your city"
    ]
  },
  Romantic: {
    type: "Romantic",
    description: "You're all about creating intimate, meaningful moments! Your ideal dates focus on connection, ambiance, and expressions of affection. You value quality time and emotional closeness.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    dateIdeas: [
      "Sunset picnic with wine and cheese",
      "Stargazing on a clear night",
      "Couples massage",
      "Rooftop dinner with city views",
      "Dancing lessons together"
    ]
  },
  Creative: {
    type: "Creative",
    description: "You're inspired by beauty and artistic expression! Your ideal dates involve making or appreciating art, music, and design. You value aesthetic experiences and creative collaboration.",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    dateIdeas: [
      "Pottery or painting class",
      "Live music at a small venue",
      "Museum or gallery exhibition",
      "DIY craft project together",
      "Photography walk around the city"
    ]
  },
  Foodie: {
    type: "Foodie",
    description: "You're passionate about culinary experiences! Your ideal dates center around discovering new flavors and sharing meals. You value quality ingredients and the social aspect of dining.",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    dateIdeas: [
      "Cooking class for a new cuisine",
      "Food truck tour of your city",
      "Wine or craft beer tasting",
      "Farmers market shopping followed by cooking together",
      "High-end restaurant tasting menu"
    ]
  },
  Intellectual: {
    type: "Intellectual",
    description: "You're driven by curiosity and mental stimulation! Your ideal dates involve learning, discussing ideas, and expanding horizons. You value thoughtful conversation and new knowledge.",
    imageUrl: "https://images.unsplash.com/photo-1565060169194-19fabf63012c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    dateIdeas: [
      "Bookstore browsing followed by coffee discussion",
      "Science museum or planetarium",
      "Documentary screening",
      "Lecture or workshop on an interesting topic",
      "Escape room or puzzle-solving activity"
    ]
  }
};

export default function PersonalityTestScreen() {
  const { colors, isDark } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, PersonalityType>>({});
  const [result, setResult] = useState<PersonalityResult | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  const handleAnswer = (questionId: number, personality: PersonalityType) => {
    // Save the answer
    setAnswers(prev => ({
      ...prev,
      [questionId]: personality
    }));
    
    // Animate out
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      // Move to next question or show result
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        calculateResult();
      }
      
      // Reset animation values
      slideAnim.setValue(width);
      fadeAnim.setValue(0);
      
      // Animate in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    });
  };
  
  const calculateResult = () => {
    // Count occurrences of each personality type
    const counts: Record<PersonalityType, number> = {
      Adventurer: 0,
      Romantic: 0,
      Creative: 0,
      Foodie: 0,
      Intellectual: 0
    };
    
    // Count each personality type from answers
    Object.values(answers).forEach(personality => {
      counts[personality]++;
    });
    
    // Find the personality with the highest count
    let maxCount = 0;
    let dominantPersonality: PersonalityType = 'Adventurer';
    
    Object.entries(counts).forEach(([personality, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantPersonality = personality as PersonalityType;
      }
    });
    
    // Set the result
    setResult(personalityResults[dominantPersonality]);
    setShowConfetti(true);
  };
  
  const goBack = () => {
    router.back();
  };
  
  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setShowConfetti(false);
    
    // Reset animation values
    slideAnim.setValue(0);
    fadeAnim.setValue(1);
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Date Personality Test</Text>
        <View style={styles.placeholder} />
      </View>
      
      {!result ? (
        <>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: colors.card }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: colors.primary,
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.subtext }]}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>
          
          <Animated.View 
            style={[
              styles.questionContainer,
              {
                transform: [{ translateX: slideAnim }],
                opacity: fadeAnim
              }
            ]}
          >
            <Text style={[styles.questionText, { color: colors.text }]}>
              {currentQuestion.text}
            </Text>
            
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    { backgroundColor: colors.card }
                  ]}
                  onPress={() => handleAnswer(currentQuestion.id, option.personality as PersonalityType)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </>
      ) : (
        <ScrollView style={styles.resultContainer} contentContainerStyle={styles.resultContent}>
          <Text style={[styles.resultTitle, { color: colors.text }]}>
            You're a <Text style={{ color: colors.primary }}>{result.type}</Text>!
          </Text>
          
          <Image
            source={{ uri: result.imageUrl }}
            style={styles.resultImage}
          />
          
          <Text style={[styles.resultDescription, { color: colors.text }]}>
            {result.description}
          </Text>
          
          <Text style={[styles.dateIdeasTitle, { color: colors.text }]}>
            Date Ideas for You:
          </Text>
          
          <View style={styles.dateIdeasContainer}>
            {result.dateIdeas.map((idea, index) => (
              <View 
                key={index}
                style={[styles.dateIdeaItem, { backgroundColor: colors.card }]}
              >
                <Check size={16} color={colors.primary} style={styles.checkIcon} />
                <Text style={[styles.dateIdeaText, { color: colors.text }]}>
                  {idea}
                </Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity
            style={[styles.restartButton, { backgroundColor: colors.primary }]}
            onPress={restartTest}
          >
            <Text style={styles.restartButtonText}>Take the Test Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.browseButton, { borderColor: colors.primary }]}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={[styles.browseButtonText, { color: colors.primary }]}>
              Browse Date Ideas
            </Text>
          </TouchableOpacity>
          
          {showConfetti && <ConfettiCannon />}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'right',
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  resultContainer: {
    flex: 1,
  },
  resultContent: {
    padding: 20,
    paddingBottom: 40,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  resultDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  dateIdeasTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  dateIdeasContainer: {
    marginBottom: 30,
  },
  dateIdeaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkIcon: {
    marginRight: 12,
  },
  dateIdeaText: {
    fontSize: 16,
  },
  restartButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  browseButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
