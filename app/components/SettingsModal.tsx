import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAppContext } from '@/context/AppContext';
import { getThemeNames, ThemeType } from '@/utils/theme';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  type: 'appearance' | 'notifications' | 'language' | 'accessibility' | 'terms' | 'safety' | 'changelog' | 'about';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  visible, 
  onClose, 
  title,
  type
}) => {
  const { colors, activeTheme } = useTheme();
  const { settings, updateSettings, setTheme } = useAppStore();
  const { 
    fontSize, 
    highContrast, 
    language, 
    setFontSize, 
    setHighContrast, 
    setLanguage,
    showNotification
  } = useAppContext();
  
  const [emailNotifications, setEmailNotifications] = useState(settings.notifications);
  const [pushNotifications, setPushNotifications] = useState(settings.notifications);
  
  const handleThemeChange = (theme: ThemeType) => {
    setTheme(theme);
    showNotification(
      'Theme Updated',
      `Theme changed to ${theme}`,
      'success'
    );
  };
  
  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
    updateSettings({ notifications: !emailNotifications });
    showNotification(
      'Notifications Updated',
      `Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}`,
      'success'
    );
  };
  
  const togglePushNotifications = () => {
    setPushNotifications(!pushNotifications);
    updateSettings({ notifications: !pushNotifications });
    showNotification(
      'Notifications Updated',
      `Push notifications ${!pushNotifications ? 'enabled' : 'disabled'}`,
      'success'
    );
  };
  
  const renderContent = () => {
    switch (type) {
      case 'appearance':
        return (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
            
            {getThemeNames().map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: activeTheme === theme.id ? colors.primary + '20' : colors.card,
                    borderColor: activeTheme === theme.id ? colors.primary : colors.border
                  }
                ]}
                onPress={() => handleThemeChange(theme.id)}
              >
                <View style={styles.themePreview}>
                  <View 
                    style={[
                      styles.themePreviewColor, 
                      { backgroundColor: colors[theme.id as keyof typeof colors]?.primary || colors.primary }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.themePreviewColor, 
                      { backgroundColor: colors[theme.id as keyof typeof colors]?.secondary || colors.secondary }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.themePreviewColor, 
                      { backgroundColor: colors[theme.id as keyof typeof colors]?.background || colors.background }
                    ]} 
                  />
                </View>
                <Text style={[styles.themeText, { color: colors.text }]}>{theme.name}</Text>
                {activeTheme === theme.id && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
        
      case 'notifications':
        return (
          <View style={styles.content}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Email Notifications</Text>
              <Switch
                value={emailNotifications}
                onValueChange={toggleEmailNotifications}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={emailNotifications ? colors.primary : colors.card}
              />
            </View>
            
            <Text style={[styles.settingDescription, { color: colors.subtext }]}>
              Receive emails about new date ideas, special events, and updates.
            </Text>
            
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
              <Switch
                value={pushNotifications}
                onValueChange={togglePushNotifications}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={pushNotifications ? colors.primary : colors.card}
              />
            </View>
            
            <Text style={[styles.settingDescription, { color: colors.subtext }]}>
              Receive push notifications for date reminders and app updates.
            </Text>
          </View>
        );
        
      case 'language':
        return (
          <View style={styles.content}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                { 
                  backgroundColor: language === 'en' ? colors.primary + '20' : colors.card,
                  borderColor: language === 'en' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>English</Text>
              {language === 'en' && (
                <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.languageOption,
                { 
                  backgroundColor: language === 'es' ? colors.primary + '20' : colors.card,
                  borderColor: language === 'es' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setLanguage('es')}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>Español</Text>
              {language === 'es' && (
                <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
            
            <Text style={[styles.comingSoon, { color: colors.subtext }]}>
              More languages coming soon!
            </Text>
          </View>
        );
        
      case 'accessibility':
        return (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Text Size</Text>
            
            <TouchableOpacity
              style={[
                styles.accessibilityOption,
                { 
                  backgroundColor: fontSize === 'small' ? colors.primary + '20' : colors.card,
                  borderColor: fontSize === 'small' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setFontSize('small')}
            >
              <Text style={[styles.fontSizeSmall, { color: colors.text }]}>Small</Text>
              {fontSize === 'small' && (
                <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.accessibilityOption,
                { 
                  backgroundColor: fontSize === 'medium' ? colors.primary + '20' : colors.card,
                  borderColor: fontSize === 'medium' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setFontSize('medium')}
            >
              <Text style={[styles.fontSizeMedium, { color: colors.text }]}>Medium</Text>
              {fontSize === 'medium' && (
                <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.accessibilityOption,
                { 
                  backgroundColor: fontSize === 'large' ? colors.primary + '20' : colors.card,
                  borderColor: fontSize === 'large' ? colors.primary : colors.border
                }
              ]}
              onPress={() => setFontSize('large')}
            >
              <Text style={[styles.fontSizeLarge, { color: colors.text }]}>Large</Text>
              {fontSize === 'large' && (
                <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
              )}
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>High Contrast</Text>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                trackColor={{ false: colors.border, true: colors.primary + '80' }}
                thumbColor={highContrast ? colors.primary : colors.card}
              />
            </View>
            
            <Text style={[styles.settingDescription, { color: colors.subtext }]}>
              Increases contrast for better readability.
            </Text>
          </View>
        );
        
      case 'terms':
        return (
          <ScrollView style={styles.scrollContent}>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              Last Updated: June 1, 2023
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>1. Acceptance of Terms</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              By accessing or using SparkLocal, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>2. User Accounts</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              You may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>3. User Content</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              You retain ownership of any content you submit to SparkLocal. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content in connection with the service.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>4. Prohibited Activities</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              You agree not to engage in any of the following:
              {'\n'}- Violating any applicable laws or regulations
              {'\n'}- Impersonating another person or entity
              {'\n'}- Submitting false or misleading information
              {'\n'}- Attempting to gain unauthorized access to the service
              {'\n'}- Using the service for any illegal or unauthorized purpose
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>5. Termination</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>6. Changes to Terms</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              We may modify these Terms of Service at any time. We will provide notice of any material changes. Your continued use of the service after such modifications constitutes your acceptance of the revised terms.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>7. Contact Information</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              If you have any questions about these Terms, please contact us at support@samuelesnow.co.
            </Text>
          </ScrollView>
        );
        
      case 'safety':
        return (
          <ScrollView style={styles.scrollContent}>
            <View style={[styles.safetyAlert, { backgroundColor: colors.error + '20', borderColor: colors.error }]}>
              <Text style={[styles.safetyAlertTitle, { color: colors.error }]}>
                Your Safety is Our Priority
              </Text>
              <Text style={[styles.safetyAlertText, { color: colors.text }]}>
                While we strive to provide quality date ideas, please use caution and good judgment when meeting someone new or visiting unfamiliar locations.
              </Text>
            </View>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Before Your Date</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              • Research the location beforehand
              {'\n'}• Tell a friend or family member where you're going
              {'\n'}• Share your location with someone you trust
              {'\n'}• Arrange your own transportation
              {'\n'}• Meet in a public place
              {'\n'}• Have a backup plan
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>During Your Date</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              • Stay in public areas, especially for first dates
              {'\n'}• Keep your phone charged and with you
              {'\n'}• Don't leave food or drinks unattended
              {'\n'}• Trust your instincts - if something feels wrong, leave
              {'\n'}• Use our check-in feature to notify contacts you're safe
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Emergency Resources</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              • Emergency: 911
              {'\n'}• National Domestic Violence Hotline: 1-800-799-7233
              {'\n'}• Crisis Text Line: Text HOME to 741741
            </Text>
            
            <TouchableOpacity 
              style={[styles.safetyButton, { backgroundColor: colors.error }]}
              onPress={() => Alert.alert('Safety Center', 'This would open the full safety center with additional resources and information.')}
            >
              <Text style={styles.safetyButtonText}>Visit Safety Center</Text>
            </TouchableOpacity>
          </ScrollView>
        );
        
      case 'changelog':
        return (
          <ScrollView style={styles.scrollContent}>
            <View style={[styles.versionCard, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
              <Text style={[styles.versionTitle, { color: colors.primary }]}>Version 2.1.0 (Current)</Text>
              <Text style={[styles.versionDate, { color: colors.subtext }]}>Released June 15, 2023</Text>
              
              <Text style={[styles.changelogTitle, { color: colors.text }]}>New Features:</Text>
              <Text style={[styles.changelogItem, { color: colors.text }]}>
                • Added customizable themes (Sunset, Midnight, Neon, Forest, Ocean, Coffee)
                {'\n'}• Improved homepage layout with better date idea loading
                {'\n'}• Enhanced safety features with prominent safety alerts
                {'\n'}• Added notification system for settings changes
                {'\n'}• Improved weather information display
                {'\n'}• Added animations to homepage elements
              </Text>
              
              <Text style={[styles.changelogTitle, { color: colors.text }]}>Bug Fixes:</Text>
              <Text style={[styles.changelogItem, { color: colors.text }]}>
                • Fixed sharing functionality
                {'\n'}• Fixed search filters modal
                {'\n'}• Fixed list/grid view toggle in saved screen
                {'\n'}• Fixed date idea submission form
                {'\n'}• Fixed profile picture upload
                {'\n'}• Fixed achievement tracking
              </Text>
            </View>
            
            <View style={[styles.versionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.versionTitle, { color: colors.text }]}>Version 2.0.0</Text>
              <Text style={[styles.versionDate, { color: colors.subtext }]}>Released May 1, 2023</Text>
              
              <Text style={[styles.changelogTitle, { color: colors.text }]}>New Features:</Text>
              <Text style={[styles.changelogItem, { color: colors.text }]}>
                • Complete app redesign with improved UI/UX
                {'\n'}• Added AI chat assistant for personalized date recommendations
                {'\n'}• Added date personality test
                {'\n'}• Added achievements system
                {'\n'}• Added weather integration for date recommendations
                {'\n'}• Added ability to rate and review date ideas
              </Text>
            </View>
            
            <View style={[styles.versionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.versionTitle, { color: colors.text }]}>Version 1.0.0</Text>
              <Text style={[styles.versionDate, { color: colors.subtext }]}>Released January 15, 2023</Text>
              
              <Text style={[styles.changelogTitle, { color: colors.text }]}>Initial Release:</Text>
              <Text style={[styles.changelogItem, { color: colors.text }]}>
                • Basic date idea discovery
                {'\n'}• Save favorite date ideas
                {'\n'}• Search and filter functionality
                {'\n'}• User accounts and profiles
                {'\n'}• Basic settings and preferences
              </Text>
            </View>
          </ScrollView>
        );
        
      case 'about':
        return (
          <ScrollView style={styles.scrollContent}>
            <Text style={[styles.aboutTitle, { color: colors.text }]}>SparkLocal</Text>
            <Text style={[styles.aboutVersion, { color: colors.subtext }]}>Version 2.1.0</Text>
            
            <Text style={[styles.paragraph, { color: colors.text }]}>
              SparkLocal helps you discover unique and exciting date ideas in your local area. Whether you're looking for a romantic evening, an adventurous outing, or a casual meetup, we've got you covered.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Mission</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              We believe that meaningful connections happen through shared experiences. Our mission is to help people create memorable moments together by discovering the best local date spots and activities.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>The Team</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              SparkLocal was created by a team of passionate developers and designers who love exploring their cities and finding hidden gems.
            </Text>
            
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
            <Text style={[styles.paragraph, { color: colors.text }]}>
              Website: samuelesnow.co
              {'\n'}Email: contact@samuelesnow.co
              {'\n'}Instagram: @sparklocal
            </Text>
            
            <TouchableOpacity 
              style={[styles.aboutButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Rate Us', 'This would open the app store rating page.')}
            >
              <Text style={styles.aboutButtonText}>Rate Us on the App Store</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.aboutButton, { backgroundColor: colors.secondary }]}
              onPress={() => Alert.alert('Feedback', 'This would open a feedback form.')}
            >
              <Text style={styles.aboutButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </ScrollView>
        );
        
      default:
        return null;
    }
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
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          {renderContent()}
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
  content: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  themePreview: {
    flexDirection: 'row',
    marginRight: 12,
  },
  themePreviewColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 4,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  comingSoon: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
  accessibilityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  fontSizeSmall: {
    fontSize: 14,
    fontWeight: '500',
  },
  fontSizeMedium: {
    fontSize: 16,
    fontWeight: '500',
  },
  fontSizeLarge: {
    fontSize: 18,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 20,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  safetyAlert: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  safetyAlertTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  safetyAlertText: {
    fontSize: 16,
    lineHeight: 24,
  },
  safetyButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  safetyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  versionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  versionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  versionDate: {
    fontSize: 14,
    marginBottom: 12,
  },
  changelogTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  changelogItem: {
    fontSize: 14,
    lineHeight: 22,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  aboutVersion: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  aboutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  aboutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
