import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Moon, 
  Bell, 
  Languages, 
  Eye, 
  FileText, 
  Shield, 
  History, 
  Info, 
  Plus,
  User,
  Award,
  Sparkles,
  Zap,
  Code,
  Rocket,
  Database,
  MessageSquare
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { SettingsItem } from '@/components/SettingsItem';
import { SettingsModal } from '@/components/SettingsModal';
import { SubmissionForm } from '@/components/SubmissionForm';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useTheme } from '@/utils/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppContext } from '@/context/AppContext';
import { useAppStore } from '@/store/useAppStore';

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuthStore();
  const { fontSize, highContrast, language, showNotification } = useAppContext();
  const { settings, updateSettings } = useAppStore();
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  
  const openModal = (modalType: string) => {
    setActiveModal(modalType);
  };
  
  const closeModal = () => {
    setActiveModal(null);
  };
  
  const navigateToAccount = () => {
    if (user) {
      router.push('/account');
    } else {
      router.push('/login');
    }
  };
  
  const navigateToAchievements = () => {
    router.push('/achievements');
  };
  
  const navigateToPersonalityTest = () => {
    router.push('/personality-test');
  };
  
  const navigateToPremium = () => {
    router.push('/premium');
  };
  
  const navigateToDevTools = () => {
    router.push('/dev-tools');
  };
  
  const getModalTitle = () => {
    switch (activeModal) {
      case 'appearance':
        return 'Appearance';
      case 'notifications':
        return 'Notifications';
      case 'language':
        return 'Language';
      case 'accessibility':
        return 'Accessibility';
      case 'terms':
        return 'Terms of Service';
      case 'safety':
        return 'Safety Policy';
      case 'changelog':
        return 'What\'s New';
      case 'about':
        return 'About SparkLocal';
      case 'data':
        return 'Data Management';
      case 'feedback':
        return 'Feedback';
      case 'experimental':
        return 'Feature Flags';
      default:
        return '';
    }
  };
  
  const toggleExperimentalFeature = (feature: string) => {
    if (settings.experimental) {
      const updatedExperimental = {
        ...settings.experimental,
        [feature]: !settings.experimental[feature as keyof typeof settings.experimental]
      };
      
      updateSettings({
        experimental: updatedExperimental
      });
      
      showNotification(
        'Feature Flag Updated',
        `${feature} ${!settings.experimental[feature as keyof typeof settings.experimental] ? 'enabled' : 'disabled'}`,
        'success'
      );
    }
  };
  
  const toggleDataManagement = (feature: string) => {
    if (settings.dataManagement) {
      const updatedDataManagement = {
        ...settings.dataManagement,
        [feature]: !settings.dataManagement[feature as keyof typeof settings.dataManagement]
      };
      
      updateSettings({
        dataManagement: updatedDataManagement
      });
      
      showNotification(
        'Data Setting Updated',
        `${feature} ${!settings.dataManagement[feature as keyof typeof settings.dataManagement] ? 'enabled' : 'disabled'}`,
        'success'
      );
    }
  };
  
  const handleSubmitFeedback = () => {
    showNotification(
      'Feedback Submitted',
      'Thank you for your feedback! We appreciate your input.',
      'success'
    );
    
    setActiveModal(null);
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Customize your experience</Text>
      </View>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <TouchableOpacity 
          style={[styles.accountSection, { backgroundColor: colors.card }]}
          onPress={navigateToAccount}
        >
          <Image 
            source={{ 
              uri: user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80' 
            }} 
            style={styles.profileImage}
          />
          <View style={styles.accountInfo}>
            <Text style={[styles.accountName, { color: colors.text }]}>
              {user ? (user.displayName || 'User') : 'Sign in'}
            </Text>
            <Text style={[styles.accountEmail, { color: colors.subtext }]}>
              {user ? user.email : 'Tap to sign in or create an account'}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Theme Selector */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
        <ThemeSelector />
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
          
          <SettingsItem
            title="Achievements"
            icon={<Award size={22} color={colors.primary} />}
            onPress={navigateToAchievements}
          />
          
          <SettingsItem
            title="Date Personality Test"
            icon={<Sparkles size={22} color={colors.primary} />}
            onPress={navigateToPersonalityTest}
          />
          
          <SettingsItem
            title="Premium Features"
            icon={<Zap size={22} color={colors.primary} />}
            onPress={navigateToPremium}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <SettingsItem
            title="Appearance"
            icon={<Moon size={22} color={colors.primary} />}
            onPress={() => openModal('appearance')}
          />
          
          <SettingsItem
            title="Notifications"
            icon={<Bell size={22} color={colors.primary} />}
            onPress={() => openModal('notifications')}
          />
          
          <SettingsItem
            title="Language"
            icon={<Languages size={22} color={colors.primary} />}
            onPress={() => openModal('language')}
          />
          
          <SettingsItem
            title="Accessibility"
            icon={<Eye size={22} color={colors.primary} />}
            onPress={() => openModal('accessibility')}
          />
          
          <SettingsItem
            title="Data Management"
            icon={<Database size={22} color={colors.primary} />}
            onPress={() => openModal('data')}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contribute</Text>
          
          <SettingsItem
            title="Submit a Date Idea"
            icon={<Plus size={22} color={colors.primary} />}
            onPress={() => setShowSubmissionForm(true)}
          />
          
          <SettingsItem
            title="Feedback"
            icon={<MessageSquare size={22} color={colors.primary} />}
            onPress={() => openModal('feedback')}
          />
          
          <SettingsItem
            title="Feature Flags"
            icon={<Code size={22} color={colors.primary} />}
            onPress={() => openModal('experimental')}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Information</Text>
          
          <SettingsItem
            title="Terms of Service"
            icon={<FileText size={22} color={colors.primary} />}
            onPress={() => openModal('terms')}
          />
          
          <SettingsItem
            title="Safety Policy"
            icon={<Shield size={22} color={colors.error} />}
            badge="Important"
            badgeColor={colors.error}
            onPress={() => openModal('safety')}
          />
          
          <SettingsItem
            title="What's New"
            icon={<History size={22} color={colors.primary} />}
            badge="Updated"
            badgeColor={colors.primary}
            onPress={() => openModal('changelog')}
          />
          
          <SettingsItem
            title="About"
            icon={<Info size={22} color={colors.primary} />}
            onPress={() => openModal('about')}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Coming Soon</Text>
          
          <View style={[styles.comingSoonCard, { backgroundColor: colors.card }]}>
            <View style={styles.comingSoonHeader}>
              <Rocket size={22} color={colors.primary} />
              <Text style={[styles.comingSoonTitle, { color: colors.text }]}>
                Exciting Features on the Way!
              </Text>
            </View>
            
            <View style={styles.comingSoonFeature}>
              <Text style={[styles.comingSoonFeatureTitle, { color: colors.text }]}>
                User-Customizable Themes
              </Text>
              <Text style={[styles.comingSoonFeatureDesc, { color: colors.subtext }]}>
                Choose from themes like "Sunset," "Midnight," "City Neon," and more
              </Text>
            </View>
            
            <View style={styles.comingSoonFeature}>
              <Text style={[styles.comingSoonFeatureTitle, { color: colors.text }]}>
                Animated Icons & Interactions
              </Text>
              <Text style={[styles.comingSoonFeatureDesc, { color: colors.subtext }]}>
                Delightful animations that make the app feel more alive
              </Text>
            </View>
            
            <View style={styles.comingSoonFeature}>
              <Text style={[styles.comingSoonFeatureTitle, { color: colors.text }]}>
                Dynamic Tag Colors
              </Text>
              <Text style={[styles.comingSoonFeatureDesc, { color: colors.subtext }]}>
                Tags that change colors based on vibe: Romantic = rose, Adventurous = forest green
              </Text>
            </View>
          </View>
        </View>
        
        {/* Developer Tools (hidden) */}
        <TouchableOpacity 
          style={styles.devToolsButton}
          onPress={navigateToDevTools}
        >
          <Code size={16} color={colors.subtext} />
        </TouchableOpacity>
        
        <Text style={[styles.footerText, { color: colors.subtext }]}>
          SparkLocal v2.1.0
        </Text>
      </ScrollView>
      
      {/* Settings Modals */}
      {activeModal && (
        <SettingsModal
          visible={!!activeModal}
          onClose={closeModal}
          title={getModalTitle()}
          type={activeModal as any}
        />
      )}
      
      {/* Submission Form */}
      <SubmissionForm
        visible={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
      />
      
      {/* Data Management Modal */}
      {activeModal === 'data' && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.overlay }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Data Management</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScrollContent}>
                <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Storage Options</Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Auto Sync</Text>
                  <Switch
                    value={settings.dataManagement?.autoSync}
                    onValueChange={() => toggleDataManagement('autoSync')}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={settings.dataManagement?.autoSync ? colors.primary : colors.card}
                  />
                </View>
                
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>
                  Automatically sync your data across devices when you're signed in.
                </Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Offline Mode</Text>
                  <Switch
                    value={settings.dataManagement?.offlineMode}
                    onValueChange={() => toggleDataManagement('offlineMode')}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={settings.dataManagement?.offlineMode ? colors.primary : colors.card}
                  />
                </View>
                
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>
                  Store data locally for offline use. May use more device storage.
                </Text>
                
                <TouchableOpacity
                  style={[styles.dataButton, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    showNotification(
                      'Data Cleared',
                      'Your local data has been cleared successfully.',
                      'success'
                    );
                    closeModal();
                  }}
                >
                  <Text style={styles.dataButtonText}>Clear Local Data</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.dataButton, { backgroundColor: colors.secondary }]}
                  onPress={() => {
                    showNotification(
                      'Data Exported',
                      'Your data has been exported successfully.',
                      'success'
                    );
                    closeModal();
                  }}
                >
                  <Text style={styles.dataButtonText}>Export My Data</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
      
      {/* Feedback Modal */}
      {activeModal === 'feedback' && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.overlay }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Feedback</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScrollContent}>
                <Text style={[styles.feedbackText, { color: colors.text }]}>
                  We value your feedback! Please let us know how we can improve SparkLocal.
                </Text>
                
                <TextInput
                  style={[styles.feedbackInput, { 
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  placeholder="Enter your feedback here..."
                  placeholderTextColor={colors.subtext}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                
                <TouchableOpacity
                  style={[styles.feedbackButton, { backgroundColor: colors.primary }]}
                  onPress={handleSubmitFeedback}
                >
                  <Text style={styles.feedbackButtonText}>Submit Feedback</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
      
      {/* Experimental Features Modal */}
      {activeModal === 'experimental' && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={[styles.modalContainer, { backgroundColor: colors.overlay }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Feature Flags</Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <X size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalScrollContent}>
                <Text style={[styles.experimentalText, { color: colors.text }]}>
                  Toggle experimental features on or off
                </Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Animated Reactions</Text>
                  <Switch
                    value={settings.experimental?.animatedReactions}
                    onValueChange={() => toggleExperimentalFeature('animatedReactions')}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={settings.experimental?.animatedReactions ? colors.primary : colors.card}
                  />
                </View>
                
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>
                  Show animations when users complete or rate dates
                </Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>AI Chat Assistant</Text>
                  <Switch
                    value={settings.experimental?.aiAssistant}
                    onValueChange={() => toggleExperimentalFeature('aiAssistant')}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={settings.experimental?.aiAssistant ? colors.primary : colors.card}
                  />
                </View>
                
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>
                  Enable the AI-powered date idea assistant
                </Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Achievements System</Text>
                  <Switch
                    value={settings.experimental?.achievements}
                    onValueChange={() => toggleExperimentalFeature('achievements')}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={settings.experimental?.achievements ? colors.primary : colors.card}
                  />
                </View>
                
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>
                  Enable the achievements and badges system
                </Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Date Personality Test</Text>
                  <Switch
                    value={settings.experimental?.personalityTest}
                    onValueChange={() => toggleExperimentalFeature('personalityTest')}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={settings.experimental?.personalityTest ? colors.primary : colors.card}
                  />
                </View>
                
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>
                  Enable the date personality quiz feature
                </Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Premium Features</Text>
                  <Switch
                    value={settings.experimental?.premium}
                    onValueChange={() => toggleExperimentalFeature('premium')}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={settings.experimental?.premium ? colors.primary : colors.card}
                  />
                </View>
                
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>
                  Enable premium subscription features
                </Text>
                
                <View style={styles.settingItem}>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>Debug Mode</Text>
                  <Switch
                    value={settings.experimental?.debugMode}
                    onValueChange={() => toggleExperimentalFeature('debugMode')}
                    trackColor={{ false: colors.border, true: colors.primary + '80' }}
                    thumbColor={settings.experimental?.debugMode ? colors.primary : colors.card}
                  />
                </View>
                
                <Text style={[styles.settingDescription, { color: colors.subtext }]}>
                  Show additional debugging information
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

import { Modal, TextInput } from 'react-native';
import { X } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  accountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  accountInfo: {
    marginLeft: 16,
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  comingSoonCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  comingSoonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  comingSoonFeature: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#FF6B6B',
    paddingVertical: 4,
  },
  comingSoonFeatureTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  comingSoonFeatureDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  devToolsButton: {
    alignSelf: 'center',
    padding: 16,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  dataButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dataButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  feedbackText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  feedbackInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    marginBottom: 16,
  },
  feedbackButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  feedbackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  experimentalText: {
    fontSize: 16,
    marginBottom: 16,
  },
});
