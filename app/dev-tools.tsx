import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  ArrowLeft, 
  Code, 
  Flag, 
  Bug, 
  MessageSquare, 
  Send,
  RefreshCw,
  Database,
  Trash2
} from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { router } from 'expo-router';
import { useAppStore } from '@/store/useAppStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function DevToolsScreen() {
  const { colors, isDark } = useTheme();
  
  // Feature flags
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: 'animated_reactions',
      name: 'Animated Reactions',
      description: 'Show animations when users complete or rate dates',
      enabled: true
    },
    {
      id: 'ai_assistant',
      name: 'AI Chat Assistant',
      description: 'Enable the AI-powered date idea assistant',
      enabled: true
    },
    {
      id: 'achievements',
      name: 'Achievements System',
      description: 'Enable the achievements and badges system',
      enabled: true
    },
    {
      id: 'personality_test',
      name: 'Date Personality Test',
      description: 'Enable the date personality quiz feature',
      enabled: true
    },
    {
      id: 'premium_features',
      name: 'Premium Features',
      description: 'Enable premium subscription features',
      enabled: true
    },
    {
      id: 'debug_mode',
      name: 'Debug Mode',
      description: 'Show additional debugging information',
      enabled: false
    }
  ]);
  
  // Feedback form
  const [feedbackType, setFeedbackType] = useState<'bug' | 'suggestion' | 'general'>('general');
  const [feedbackText, setFeedbackText] = useState('');
  
  const toggleFeatureFlag = (id: string) => {
    setFeatureFlags(prev => 
      prev.map(flag => 
        flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
      )
    );
  };
  
  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter some feedback text');
      return;
    }
    
    // In a real app, this would send the feedback to a server
    Alert.alert(
      'Feedback Submitted',
      'Thank you for your feedback! It has been recorded.',
      [
        { 
          text: 'OK', 
          onPress: () => setFeedbackText('') 
        }
      ]
    );
  };
  
  const clearAppData = async () => {
    Alert.alert(
      'Clear App Data',
      'This will reset all app data including saved date ideas, ratings, and settings. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                'Data Cleared',
                'All app data has been reset. The app will now restart.',
                [
                  { 
                    text: 'OK', 
                    onPress: () => router.replace('/(tabs)') 
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to clear app data');
            }
          }
        }
      ]
    );
  };
  
  const goBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Developer Tools</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Flag size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Feature Flags</Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: colors.subtext }]}>
            Toggle experimental features on or off
          </Text>
          
          {featureFlags.map(flag => (
            <View key={flag.id} style={styles.flagItem}>
              <View style={styles.flagInfo}>
                <Text style={[styles.flagName, { color: colors.text }]}>{flag.name}</Text>
                <Text style={[styles.flagDescription, { color: colors.subtext }]}>
                  {flag.description}
                </Text>
              </View>
              <Switch
                value={flag.enabled}
                onValueChange={() => toggleFeatureFlag(flag.id)}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={'#f4f3f4'}
              />
            </View>
          ))}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <MessageSquare size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Feedback</Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: colors.subtext }]}>
            Submit bugs, suggestions, or general feedback
          </Text>
          
          <View style={styles.feedbackTypeContainer}>
            <TouchableOpacity
              style={[
                styles.feedbackTypeButton,
                { 
                  backgroundColor: feedbackType === 'bug' 
                    ? colors.primary 
                    : colors.background 
                }
              ]}
              onPress={() => setFeedbackType('bug')}
            >
              <Bug 
                size={16} 
                color={feedbackType === 'bug' ? 'white' : colors.text} 
              />
              <Text 
                style={[
                  styles.feedbackTypeText, 
                  { 
                    color: feedbackType === 'bug' ? 'white' : colors.text 
                  }
                ]}
              >
                Bug
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.feedbackTypeButton,
                { 
                  backgroundColor: feedbackType === 'suggestion' 
                    ? colors.primary 
                    : colors.background 
                }
              ]}
              onPress={() => setFeedbackType('suggestion')}
            >
              <Flag 
                size={16} 
                color={feedbackType === 'suggestion' ? 'white' : colors.text} 
              />
              <Text 
                style={[
                  styles.feedbackTypeText, 
                  { 
                    color: feedbackType === 'suggestion' ? 'white' : colors.text 
                  }
                ]}
              >
                Suggestion
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.feedbackTypeButton,
                { 
                  backgroundColor: feedbackType === 'general' 
                    ? colors.primary 
                    : colors.background 
                }
              ]}
              onPress={() => setFeedbackType('general')}
            >
              <MessageSquare 
                size={16} 
                color={feedbackType === 'general' ? 'white' : colors.text} 
              />
              <Text 
                style={[
                  styles.feedbackTypeText, 
                  { 
                    color: feedbackType === 'general' ? 'white' : colors.text 
                  }
                ]}
              >
                General
              </Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[
              styles.feedbackInput,
              { 
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            placeholder={
              feedbackType === 'bug' 
                ? 'Describe the bug and steps to reproduce...' 
                : feedbackType === 'suggestion' 
                  ? 'Describe your feature suggestion...' 
                  : 'Enter your feedback...'
            }
            placeholderTextColor={colors.subtext}
            value={feedbackText}
            onChangeText={setFeedbackText}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              { 
                backgroundColor: feedbackText.trim() ? colors.primary : colors.card,
                opacity: feedbackText.trim() ? 1 : 0.7
              }
            ]}
            onPress={handleSubmitFeedback}
            disabled={!feedbackText.trim()}
          >
            <Send size={16} color="white" style={styles.submitIcon} />
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Database size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: colors.subtext }]}>
            Manage app data and storage
          </Text>
          
          <TouchableOpacity
            style={[styles.dataButton, { backgroundColor: colors.background }]}
            onPress={() => Alert.alert('Info', 'This would refresh app data in a real app')}
          >
            <RefreshCw size={16} color={colors.primary} style={styles.dataButtonIcon} />
            <Text style={[styles.dataButtonText, { color: colors.text }]}>
              Refresh App Data
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.dataButton, { backgroundColor: colors.background }]}
            onPress={clearAppData}
          >
            <Trash2 size={16} color={colors.error} style={styles.dataButtonIcon} />
            <Text style={[styles.dataButtonText, { color: colors.error }]}>
              Clear All App Data
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Code size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>App Information</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.subtext }]}>Version</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>2.1.0 (Build 42)</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.subtext }]}>Environment</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>Development</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.subtext }]}>API Endpoint</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>https://api.sparklocal.app/v1</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.subtext }]}>Device ID</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>DEV-SIMULATOR-12345</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  flagItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  flagInfo: {
    flex: 1,
    marginRight: 16,
  },
  flagName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  flagDescription: {
    fontSize: 12,
  },
  feedbackTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feedbackTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  feedbackTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  dataButtonIcon: {
    marginRight: 12,
  },
  dataButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
});
