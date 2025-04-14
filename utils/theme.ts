import { useColorScheme } from 'react-native';
import { colors, ThemeType } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';
import { useAppContext } from '@/context/AppContext';

export const useTheme = () => {
  const systemTheme = useColorScheme() || 'light';
  const { settings } = useAppStore();
  const { highContrast } = useAppContext();
  
  // Handle custom themes
  const customThemes = ['sunset', 'midnight', 'neon', 'forest', 'ocean', 'coffee'];
  
  let activeTheme: string = 
    settings.theme === 'system' 
      ? systemTheme as 'light' | 'dark'
      : settings.theme;
  
  // Check if the theme is a custom theme
  const isCustomTheme = customThemes.includes(activeTheme);
  const isDark = !isCustomTheme && activeTheme === 'dark';
  
  // Apply high contrast if enabled
  let themeColors = colors[activeTheme as keyof typeof colors] || colors.light;
  
  if (highContrast && !isCustomTheme) {
    // Enhance contrast for better visibility
    if (activeTheme === 'light') {
      themeColors = {
        ...themeColors,
        text: '#000000',
        subtext: '#333333',
        background: '#FFFFFF',
        card: '#F0F0F0',
        border: '#000000',
      };
    } else {
      themeColors = {
        ...themeColors,
        text: '#FFFFFF',
        subtext: '#DDDDDD',
        background: '#000000',
        card: '#222222',
        border: '#FFFFFF',
      };
    }
  }
  
  return {
    colors: themeColors,
    isDark,
    activeTheme,
    isCustomTheme,
  };
};

export const getThemeValue = (themeType: ThemeType, systemTheme: string | null | undefined): string => {
  if (themeType === 'system') {
    return (systemTheme || 'light');
  }
  return themeType;
};

export const getThemeNames = (): { id: ThemeType; name: string }[] => {
  return [
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'system', name: 'System Default' },
    { id: 'sunset', name: 'Sunset' },
    { id: 'midnight', name: 'Midnight' },
    { id: 'neon', name: 'Neon' },
    { id: 'forest', name: 'Forest' },
    { id: 'ocean', name: 'Ocean' },
    { id: 'coffee', name: 'Coffee' }
  ];
};
