import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  Switch,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  LogOut, 
  Camera, 
  Calendar, 
  MapPin, 
  Heart, 
  Star, 
  Award,
  Globe,
  Bell,
  Shield
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { signOut, updateUserProfile } from '@/utils/firebase';
import * as ImagePicker from 'expo-image-picker';

export default function AccountScreen() {
  const { colors, isDark } = useTheme();
  const { user, setUser } = useAuthStore();
  const { savedDateIdeas, dateRatings } = useAppStore();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [safetyAlerts, setSafetyAlerts] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(isDark);
  
  // Activity stats
  const [activityStats, setActivityStats] = useState({
    savedIdeas: 0,
    completedDates: 0,
    averageRating: 0,
    favoriteLocation: '',
    favoriteVibe: ''
  });
  
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);
  
  useEffect(() => {
    // Calculate activity stats
    const savedCount = savedDateIdeas.length;
    const ratedCount = Object.keys(dateRatings).length;
    
    // Calculate average rating
    let totalRating = 0;
    let ratingCount = 0;
    
    Object.values(dateRatings).forEach(rating => {
      totalRating += rating;
      ratingCount++;
    });
    
    const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '0.0';
    
    setActivityStats({
      savedIdeas: savedCount,
      completedDates: ratedCount,
      averageRating: parseFloat(avgRating),
      favoriteLocation: 'San Francisco',
      favoriteVibe: 'Romantic'
    });
  }, [savedDateIdeas, dateRatings]);
  
  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (user) {
        const updatedUser = await updateUserProfile(user, {
          displayName: displayName.trim()
        });
        
        if (updatedUser) {
          setUser(updatedUser);
          Alert.alert('Success', 'Profile updated successfully');
          setIsEditing(false);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      await signOut();
      // Use router.replace instead of logout function
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to log out');
      setIsLoggingOut(false);
    }
  };
  
  const goBack = () => {
    router.back();
  };
  
  const toggleEmailNotifications = () => {
    setEmailNotifications(!emailNotifications);
    Alert.alert(
      'Notification Setting Updated',
      `Email notifications ${!emailNotifications ? 'enabled' : 'disabled'}.`
    );
  };
  
  const togglePushNotifications = () => {
    setPushNotifications(!pushNotifications);
    Alert.alert(
      'Notification Setting Updated',
      `Push notifications ${!pushNotifications ? 'enabled' : 'disabled'}.`
    );
  };
  
  const toggleSafetyAlerts = () => {
    setSafetyAlerts(!safetyAlerts);
    Alert.alert(
      'Safety Setting Updated',
      `Safety alerts ${!safetyAlerts ? 'enabled' : 'disabled'}.`
    );
  };
  
  const toggleLocationSharing = () => {
    setLocationSharing(!locationSharing);
    Alert.alert(
      'Location Setting Updated',
      `Location sharing ${!locationSharing ? 'enabled' : 'disabled'}.`
    );
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    Alert.alert(
      'Theme Setting Updated',
      `Dark mode ${!darkMode ? 'enabled' : 'disabled'}. This will take effect after restarting the app.`
    );
  };
  
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need camera roll permissions to change your profile picture.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        Alert.alert('Profile Picture', 'Your profile picture has been updated successfully.');
        // In a real app, we would upload this to storage and update the user profile
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick an image. Please try again.');
    }
  };
  
  const visitWebsite = () => {
    Linking.openURL('https://samuelesnow.co');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Account</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.card }]}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <User size={40} color={colors.primary} />
            )}
            <TouchableOpacity 
              style={[styles.cameraButton, { backgroundColor: colors.primary }]}
              onPress={handlePickImage}
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <View style={styles.editNameContainer}>
                <TextInput
                  style={[styles.nameInput, { 
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.card
                  }]}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.subtext}
                />
                <View style={styles.editButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.cancelButton, { borderColor: colors.border }]}
                    onPress={() => {
                      setDisplayName(user?.displayName || '');
                      setIsEditing(false);
                    }}
                  >
                    <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.saveButton, { backgroundColor: colors.primary }]}
                    onPress={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.nameContainer}>
                <Text style={[styles.displayName, { color: colors.text }]}>
                  {user?.displayName || 'User'}
                </Text>
                <TouchableOpacity 
                  style={[styles.editButton, { backgroundColor: colors.card }]}
                  onPress={() => setIsEditing(true)}
                >
                  <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
            <Text style={[styles.email, { color: colors.subtext }]}>{email}</Text>
            
            <TouchableOpacity 
              style={[styles.websiteButton, { backgroundColor: colors.card }]}
              onPress={visitWebsite}
            >
              <Globe size={14} color={colors.primary} />
              <Text style={[styles.websiteText, { color: colors.primary }]}>
                samuelesnow.co
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Activity</Text>
          
          <View style={styles.activityStats}>
            <View style={styles.statItem}>
              <Heart size={20} color={colors.primary} />
              <View style={styles.statTextContainer}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {activityStats.savedIdeas}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>
                  Saved Ideas
                </Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <Calendar size={20} color={colors.primary} />
              <View style={styles.statTextContainer}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {activityStats.completedDates}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>
                  Completed Dates
                </Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <Star size={20} color={colors.primary} />
              <View style={styles.statTextContainer}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {activityStats.averageRating}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>
                  Avg. Rating
                </Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <MapPin size={20} color={colors.primary} />
              <View style={styles.statTextContainer}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {activityStats.favoriteLocation}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>
                  Favorite Location
                </Text>
              </View>
            </View>
            
            <View style={styles.statItem}>
              <Award size={20} color={colors.primary} />
              <View style={styles.statTextContainer}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {activityStats.favoriteVibe}
                </Text>
                <Text style={[styles.statLabel, { color: colors.subtext }]}>
                  Favorite Vibe
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={toggleEmailNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={emailNotifications ? colors.primary : colors.card}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={togglePushNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={pushNotifications ? colors.primary : colors.card}
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Safety & Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              <Shield size={18} color={colors.error} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: colors.text }]}>Safety Alerts</Text>
            </View>
            <Switch
              value={safetyAlerts}
              onValueChange={toggleSafetyAlerts}
              trackColor={{ false: colors.border, true: colors.error + '80' }}
              thumbColor={safetyAlerts ? colors.error : colors.card}
            />
          </View>
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Location Sharing</Text>
            <Switch
              value={locationSharing}
              onValueChange={toggleLocationSharing}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={locationSharing ? colors.primary : colors.card}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.safetyButton}
            onPress={() => Alert.alert('Safety Center', 'Our safety center provides resources and tips for safe dating. This feature is coming soon.')}
          >
            <Text style={[styles.safetyButtonText, { color: colors.error }]}>
              View Safety Center
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={darkMode ? colors.primary : colors.card}
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.border }]}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color={colors.error} />
          ) : (
            <>
              <LogOut size={20} color={colors.error} />
              <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
            </>
          )}
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.subtext }]}>
            SparkLocal v1.0.0
          </Text>
          <TouchableOpacity onPress={() => Alert.alert('Terms & Privacy', 'View our terms of service and privacy policy. This feature is coming soon.')}>
            <Text style={[styles.termsText, { color: colors.primary }]}>
              Terms & Privacy
            </Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    marginRight: 8,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  email: {
    fontSize: 14,
    marginBottom: 8,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  websiteText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  editNameContainer: {
    marginBottom: 8,
  },
  nameInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  editButtonsContainer: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flex: 2,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  activityStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  statTextContainer: {
    marginLeft: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  safetyButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  safetyButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 12,
    marginBottom: 4,
  },
  termsText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
