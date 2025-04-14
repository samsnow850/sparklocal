import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, DateIdea, SearchFilters, WeatherCondition } from '@/types';
import { dateIdeas } from '@/mocks/dateIdeas';

interface AppState {
  // Date ideas
  dateIdeas: DateIdea[];
  savedDateIdeas: string[];
  dateRatings: Record<string, number>;
  
  // Weather
  currentWeather: WeatherCondition | null;
  
  // Search
  searchFilters: SearchFilters;
  
  // Settings
  settings: AppSettings;
  
  // Actions
  saveDateIdea: (id: string) => void;
  unsaveDateIdea: (id: string) => void;
  rateDateIdea: (id: string, rating: number) => void;
  setCurrentWeather: (weather: WeatherCondition) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  applyFontSize: () => void;
  applyHighContrast: () => void;
  applyLanguage: (language: 'en' | 'es') => void;
  setTheme: (theme: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      dateIdeas: dateIdeas,
      savedDateIdeas: [],
      dateRatings: {},
      currentWeather: null,
      searchFilters: {
        query: '',
        location: '',
        price: [],
        duration: [],
        vibes: [],
        mapView: false,
      },
      settings: {
        theme: 'system',
        notifications: true,
        language: 'en',
        accessibility: {
          fontSize: 'medium',
          highContrast: false,
        },
        safety: {
          safetyAlerts: true,
          locationSharing: false,
          emergencyContacts: [],
        },
        dataManagement: {
          autoSync: true,
          offlineMode: false,
        },
        experimental: {
          animatedReactions: true,
          aiAssistant: true,
          achievements: true,
          personalityTest: true,
          premium: false,
          debugMode: false,
        }
      },
      
      // Actions
      saveDateIdea: (id: string) => 
        set((state) => ({
          savedDateIdeas: state.savedDateIdeas.includes(id) 
            ? state.savedDateIdeas 
            : [...state.savedDateIdeas, id]
        })),
        
      unsaveDateIdea: (id: string) => 
        set((state) => ({
          savedDateIdeas: state.savedDateIdeas.filter(savedId => savedId !== id)
        })),
        
      rateDateIdea: (id: string, rating: number) => 
        set((state) => ({
          dateRatings: { ...state.dateRatings, [id]: rating }
        })),
        
      setCurrentWeather: (weather: WeatherCondition) => 
        set({ currentWeather: weather }),
        
      updateSearchFilters: (filters: Partial<SearchFilters>) => 
        set((state) => ({
          searchFilters: { ...state.searchFilters, ...filters }
        })),
        
      updateSettings: (newSettings: Partial<AppSettings>) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      
      // Apply font size changes to the app
      applyFontSize: () => {
        const { settings } = get();
        // In a real app, this would update a global style or context
        console.log(`Font size changed to: ${settings.accessibility.fontSize}`);
        // We would apply this to Text components via a context or global style
      },
      
      // Apply high contrast mode
      applyHighContrast: () => {
        const { settings } = get();
        // In a real app, this would update the color scheme
        console.log(`High contrast mode: ${settings.accessibility.highContrast}`);
        // We would apply this to the theme via a context
      },
      
      // Apply language changes
      applyLanguage: (language: 'en' | 'es') => {
        // In a real app, this would load language strings
        console.log(`Language changed to: ${language}`);
        // We would update i18n context or load new strings
      },
      
      // Set theme
      setTheme: (theme: string) => {
        set((state) => ({
          settings: {
            ...state.settings,
            theme
          }
        }));
      }
    }),
    {
      name: 'spark-local-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
