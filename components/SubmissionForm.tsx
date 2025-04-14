import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { X, MapPin, DollarSign, Clock, Tag, Image as ImageIcon } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { useAppContext } from '@/context/AppContext';

interface SubmissionFormProps {
  visible: boolean;
  onClose: () => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { showNotification } = useAppContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [vibes, setVibes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    // Validate form
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your date idea');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for your date idea');
      return;
    }
    
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location for your date idea');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success notification
      showNotification(
        'Submission Successful',
        'Thank you for your date idea submission! Our team will review it shortly.',
        'success'
      );
      
      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setPrice('');
      setDuration('');
      setVibes('');
      setImageUrl('');
      
      // Close modal
      onClose();
    }, 1500);
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
            <Text style={[styles.title, { color: colors.text }]}>Submit a Date Idea</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Enter a catchy title"
              placeholderTextColor={colors.subtext}
              value={title}
              onChangeText={setTitle}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border
              }]}
              placeholder="Describe the date idea in detail"
              placeholderTextColor={colors.subtext}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
            
            <Text style={[styles.label, { color: colors.text }]}>Location *</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIconField, { 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Where is this date idea located?"
                placeholderTextColor={colors.subtext}
                value={location}
                onChangeText={setLocation}
              />
            </View>
            
            <Text style={[styles.label, { color: colors.text }]}>Price Range</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIconField, { 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="e.g., $, $$, $$$"
                placeholderTextColor={colors.subtext}
                value={price}
                onChangeText={setPrice}
              />
            </View>
            
            <Text style={[styles.label, { color: colors.text }]}>Duration</Text>
            <View style={styles.inputWithIcon}>
              <Clock size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIconField, { 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="e.g., 1-2 hours, Half day"
                placeholderTextColor={colors.subtext}
                value={duration}
                onChangeText={setDuration}
              />
            </View>
            
            <Text style={[styles.label, { color: colors.text }]}>Vibes (comma separated)</Text>
            <View style={styles.inputWithIcon}>
              <Tag size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIconField, { 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="e.g., Romantic, Adventurous, Casual"
                placeholderTextColor={colors.subtext}
                value={vibes}
                onChangeText={setVibes}
              />
            </View>
            
            <Text style={[styles.label, { color: colors.text }]}>Image URL (optional)</Text>
            <View style={styles.inputWithIcon}>
              <ImageIcon size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIconField, { 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Enter a URL for an image"
                placeholderTextColor={colors.subtext}
                value={imageUrl}
                onChangeText={setImageUrl}
              />
            </View>
            
            <Text style={[styles.note, { color: colors.subtext }]}>
              * Required fields
            </Text>
            
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Date Idea</Text>
              )}
            </TouchableOpacity>
            
            <Text style={[styles.disclaimer, { color: colors.subtext }]}>
              By submitting, you agree to our Terms of Service and confirm this is your original content or you have permission to share it.
            </Text>
          </ScrollView>
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
    maxHeight: '90%',
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
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 120,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWithIconField: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  note: {
    fontSize: 14,
    marginBottom: 20,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
});
