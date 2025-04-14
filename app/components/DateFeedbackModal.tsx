import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import { X, Star, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { DateIdea } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import ConfettiCannon from './ConfettiCannon';

interface DateFeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  dateIdea: DateIdea;
}

export const DateFeedbackModal: React.FC<DateFeedbackModalProps> = ({ 
  visible, 
  onClose,
  dateIdea
}) => {
  const { colors } = useTheme();
  const { rateDateIdea } = useAppStore();
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleRating = (value: number) => {
    setRating(value);
  };
  
  const handleSubmit = () => {
    // Save the rating
    if (rating > 0) {
      rateDateIdea(dateIdea.id, rating);
    }
    
    // In a real app, we would send the feedback to a server
    console.log('Feedback submitted:', { rating, feedback, dateIdeaId: dateIdea.id });
    
    // Show confetti animation
    setShowConfetti(true);
    setSubmitted(true);
    
    // Close after a delay
    setTimeout(() => {
      onClose();
      // Reset state after closing
      setTimeout(() => {
        setRating(0);
        setFeedback('');
        setShowConfetti(false);
        setSubmitted(false);
      }, 300);
    }, 2000);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          {!submitted ? (
            <>
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>How was your date?</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.subtitle, { color: colors.subtext }]}>
                Your feedback helps us improve recommendations!
              </Text>
              
              <Text style={[styles.dateTitle, { color: colors.text }]}>{dateIdea.title}</Text>
              
              <View style={styles.ratingContainer}>
                <Text style={[styles.ratingLabel, { color: colors.text }]}>Rate your experience:</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRating(star)}
                      style={styles.starButton}
                    >
                      <Star
                        size={36}
                        color={colors.primary}
                        fill={star <= rating ? colors.primary : 'transparent'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.feedbackContainer}>
                <Text style={[styles.feedbackLabel, { color: colors.text }]}>Additional feedback (optional):</Text>
                <TextInput
                  style={[
                    styles.feedbackInput,
                    { 
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  placeholder="Tell us more about your experience..."
                  placeholderTextColor={colors.subtext}
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { 
                    backgroundColor: rating > 0 ? colors.primary : colors.card,
                    opacity: rating > 0 ? 1 : 0.7
                  }
                ]}
                onPress={handleSubmit}
                disabled={rating === 0}
              >
                <Text style={[
                  styles.submitButtonText,
                  { color: rating > 0 ? 'white' : colors.subtext }
                ]}>
                  Submit Feedback
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.thankYouContainer}>
              <Text style={[styles.thankYouTitle, { color: colors.text }]}>Thank You!</Text>
              <Text style={[styles.thankYouText, { color: colors.subtext }]}>
                Your feedback helps make SparkLocal better for everyone.
              </Text>
              {showConfetti && <ConfettiCannon />}
            </View>
          )}
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
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ratingContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 8,
  },
  feedbackContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  feedbackLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    fontSize: 16,
  },
  submitButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  thankYouContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 300,
  },
  thankYouTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  thankYouText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
