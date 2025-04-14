import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme, Alert } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { colors as themeColors } from '@/constants/colors';

// Define the translations interface
interface Translations {
  [key: string]: string; // Add index signature
  welcome: string;
  discover: string;
  signIn: string;
  surpriseMe: string;
  dateOfDay: string;
  featuredIdeas: string;
  popularSpots: string;
  sunnyDays: string;
  outdoors: string;
  allDateIdeas: string;
  seeAll: string;
  settingUpdated: string;
  settingEnabled: string;
  settingDisabled: string;
  themeChanged: string;
  submissionSuccess: string;
  submissionError: string;
  safetyAlert: string;
  safetyTips: string;
}

// Define the context type
type AppContextType = {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  language: 'en' | 'es';
  translations: Translations;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setHighContrast: (enabled: boolean) => void;
  setLanguage: (lang: 'en' | 'es') => void;
  t: (key: string) => string;
  showNotification: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
};

// Create the context with default values
const AppContext = createContext<AppContextType>({
  fontSize: 'medium',
  highContrast: false,
  language: 'en',
  translations: {} as Translations,
  setFontSize: () => {},
  setHighContrast: () => {},
  setLanguage: () => {},
  t: (key) => key,
  showNotification: () => {},
});

// English translations
const enTranslations: Translations = {
  welcome: 'Welcome to',
  discover: 'Discover local date ideas',
  signIn: 'Sign In',
  surpriseMe: 'Surprise Me',
  dateOfDay: 'Date of the Day',
  featuredIdeas: 'Featured Ideas',
  popularSpots: 'Popular date spots near you',
  sunnyDays: 'Perfect for Sunny Days',
  outdoors: 'Enjoy the great outdoors',
  allDateIdeas: 'All Date Ideas',
  seeAll: 'See All',
  settingUpdated: 'Setting Updated',
  settingEnabled: 'enabled',
  settingDisabled: 'disabled',
  themeChanged: 'Theme changed to',
  submissionSuccess: 'Thank you for your submission! Your date idea has been received.',
  submissionError: 'There was an error submitting your date idea. Please try again.',
  safetyAlert: 'Safety Alert',
  safetyTips: 'Remember to meet in public places and let someone know where you\'re going.',
  // Add more translations as needed
};

// Spanish translations
const esTranslations: Translations = {
  welcome: 'Bienvenido a',
  discover: 'Descubre ideas para citas locales',
  signIn: 'Iniciar Sesión',
  surpriseMe: 'Sorpréndeme',
  dateOfDay: 'Cita del Día',
  featuredIdeas: 'Ideas Destacadas',
  popularSpots: 'Lugares populares cerca de ti',
  sunnyDays: 'Perfecto para Días Soleados',
  outdoors: 'Disfruta del aire libre',
  allDateIdeas: 'Todas las Ideas de Citas',
  seeAll: 'Ver Todo',
  settingUpdated: 'Configuración Actualizada',
  settingEnabled: 'activado',
  settingDisabled: 'desactivado',
  themeChanged: 'Tema cambiado a',
  submissionSuccess: 'Gracias por tu envío! Tu idea de cita ha sido recibida.',
  submissionError: 'Hubo un error al enviar tu idea de cita. Por favor, inténtalo de nuevo.',
  safetyAlert: 'Alerta de Seguridad',
  safetyTips: 'Recuerda reunirte en lugares públicos y avisar a alguien a dónde vas.',
  // Add more translations as needed
};

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useAppStore();
  const systemTheme = useColorScheme() || 'light';
  
  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>(
    settings.accessibility.fontSize
  );
  const [highContrast, setHighContrastState] = useState<boolean>(
    settings.accessibility.highContrast
  );
  const [language, setLanguageState] = useState<'en' | 'es'>(settings.language);
  const [translations, setTranslations] = useState<Translations>(
    language === 'en' ? enTranslations : esTranslations
  );
  
  // Update settings when state changes
  useEffect(() => {
    updateSettings({
      accessibility: {
        ...settings.accessibility,
        fontSize,
        highContrast,
      },
      language,
    });
    
    // Update translations when language changes
    setTranslations(language === 'en' ? enTranslations : esTranslations);
  }, [fontSize, highContrast, language]);
  
  // Set font size
  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
    showNotification(
      translations.settingUpdated,
      `Font size ${size}`,
      'success'
    );
  };
  
  // Set high contrast
  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    showNotification(
      translations.settingUpdated,
      `High contrast mode ${enabled ? translations.settingEnabled : translations.settingDisabled}`,
      'success'
    );
  };
  
  // Set language
  const setLanguage = (lang: 'en' | 'es') => {
    setLanguageState(lang);
    // Use the current translations before they change
    const currentTranslations = lang === 'en' ? enTranslations : esTranslations;
    showNotification(
      currentTranslations.settingUpdated,
      `Language changed to ${lang === 'en' ? 'English' : 'Español'}`,
      'success'
    );
  };
  
  // Translation function
  const t = (key: string): string => {
    return translations[key] || key;
  };
  
  // Show notification
  const showNotification = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    Alert.alert(title, message);
  };
  
  return (
    <AppContext.Provider
      value={{
        fontSize,
        highContrast,
        language,
        translations,
        setFontSize,
        setHighContrast,
        setLanguage,
        t,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);
