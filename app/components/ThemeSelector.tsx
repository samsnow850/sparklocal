import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useTheme, getThemeNames } from '@/utils/theme';
import { useAppStore } from '@/store/useAppStore';
import { useAppContext } from '@/context/AppContext';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const THEME_ITEM_WIDTH = (width - 60) / 2;

interface ThemeSelectorProps {
  onSelect?: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelect }) => {
  const { activeTheme } = useTheme();
  const { setTheme } = useAppStore();
  const { showNotification } = useAppContext();
  
  const themeOptions = getThemeNames();
  
  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    
    showNotification(
      'Theme Updated',
      `Theme changed to ${themeId}`,
      'success'
    );
    
    if (onSelect) {
      onSelect();
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {themeOptions.map((theme) => {
          const themeColors = colors[theme.id as keyof typeof colors];
          
          return (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeItem,
                { 
                  backgroundColor: themeColors?.card || '#F9F9F9',
                  borderColor: activeTheme === theme.id 
                    ? themeColors?.primary || '#FF6B6B' 
                    : 'transparent',
                  borderWidth: activeTheme === theme.id ? 3 : 0,
                }
              ]}
              onPress={() => handleThemeSelect(theme.id)}
            >
              <View style={styles.themePreview}>
                <View 
                  style={[
                    styles.colorPreview, 
                    { backgroundColor: themeColors?.primary || '#FF6B6B' }
                  ]} 
                />
                <View 
                  style={[
                    styles.colorPreview, 
                    { backgroundColor: themeColors?.secondary || '#4ECDC4' }
                  ]} 
                />
              </View>
              
              <Text 
                style={[
                  styles.themeName,
                  { color: themeColors?.text || '#333333' }
                ]}
              >
                {theme.name}
              </Text>
              
              {activeTheme === theme.id && (
                <View 
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: themeColors?.primary || '#FF6B6B' }
                  ]} 
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  themeItem: {
    width: THEME_ITEM_WIDTH,
    height: 120,
    borderRadius: 16,
    marginRight: 12,
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themePreview: {
    flexDirection: 'row',
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
