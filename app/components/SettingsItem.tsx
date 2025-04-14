import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/utils/theme';

interface SettingsItemProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  showChevron?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ 
  title, 
  icon, 
  onPress, 
  showChevron = true 
}) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {showChevron && (
        <ChevronRight size={20} color={colors.subtext} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
