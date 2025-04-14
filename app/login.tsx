import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { signInWithEmailAndPassword, signInWithGoogle } from '@/utils/firebase';
import { User } from '@/types';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { setUser } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would authenticate with Firebase
      const user = await signInWithEmailAndPassword(email, password);
      
      if (user) {
        // Convert to our User type
        const appUser: User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // Add other required properties
          emailVerified: user.emailVerified,
          isAnonymous: user.isAnonymous,
          metadata: user.metadata,
          providerData: user.providerData,
          refreshToken: user.refreshToken,
          tenantId: user.tenantId
        };
        
        setUser(appUser);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    
    try {
      // In a real app, this would authenticate with Google via Firebase
      const user = await signInWithGoogle();
      
      if (user) {
        // Convert to our User type
        const appUser: User = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // Add other required properties
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: "",
          tenantId: null
        };
        
        setUser(appUser);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      // For demo purposes, create a mock user
      const mockUser: User = {
        uid: '123456',
        email: 'demo@example.com',
        displayName: 'Demo User',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        // Add other required properties
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null
      };
      
      setUser(mockUser);
      router.replace('/(tabs)');
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  const goToSignUp = () => {
    router.push('/signup');
  };
  
  const goBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80' }}
              style={styles.logo}
            />
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              Sign in to continue discovering amazing date ideas
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Mail size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Email"
                placeholderTextColor={colors.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }]}
                placeholder="Password"
                placeholderTextColor={colors.subtext}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.subtext} />
                ) : (
                  <Eye size={20} color={colors.subtext} />
                )}
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
            
            <View style={styles.orContainer}>
              <View style={[styles.orLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.orText, { color: colors.subtext }]}>OR</Text>
              <View style={[styles.orLine, { backgroundColor: colors.border }]} />
            </View>
            
            <TouchableOpacity
              style={[styles.googleButton, { 
                backgroundColor: colors.card,
                borderColor: colors.border
              }]}
              onPress={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <>
                  <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                    style={styles.googleIcon}
                  />
                  <Text style={[styles.googleButtonText, { color: colors.text }]}>
                    Continue with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: colors.subtext }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={goToSignUp}>
              <Text style={[styles.signupLink, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 48,
    borderWidth: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  googleButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: 20,
  },
  signupText: {
    fontSize: 16,
    marginRight: 4,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
