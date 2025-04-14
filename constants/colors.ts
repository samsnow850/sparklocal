// Color palette for SparkLocal app
export const colors = {
  light: {
    primary: '#FF6B6B', // Coral pink
    secondary: '#4ECDC4', // Teal
    background: '#FFFFFF',
    card: '#F9F9F9',
    text: '#333333',
    subtext: '#666666',
    border: '#EEEEEE',
    icon: '#555555',
    success: '#2ECC71',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB',
    overlay: 'rgba(0, 0, 0, 0.5)',
    tag: {
      background: '#F0F0F0',
      text: '#555555'
    }
  },
  dark: {
    primary: '#FF6B6B', // Keep coral pink
    secondary: '#4ECDC4', // Keep teal
    background: '#121212',
    card: '#1E1E1E',
    text: '#F5F5F5',
    subtext: '#AAAAAA',
    border: '#333333',
    icon: '#BBBBBB',
    success: '#2ECC71',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB',
    overlay: 'rgba(0, 0, 0, 0.7)',
    tag: {
      background: '#333333',
      text: '#DDDDDD'
    }
  },
  // New custom themes
  sunset: {
    primary: '#FF9E7D', // Soft orange
    secondary: '#7D67EE', // Purple
    background: '#FFF8F0', // Warm white
    card: '#FFF1E6',
    text: '#4A3F35',
    subtext: '#7D6E63',
    border: '#FFE0CC',
    icon: '#B38E76',
    success: '#7DCE82',
    error: '#FF7D7D',
    warning: '#FFBB66',
    info: '#66BBFF',
    overlay: 'rgba(179, 142, 118, 0.5)',
    tag: {
      background: '#FFE0CC',
      text: '#B38E76'
    }
  },
  midnight: {
    primary: '#7D67EE', // Purple
    secondary: '#67EECA', // Teal
    background: '#0F1A2A', // Deep blue
    card: '#1A2A3F',
    text: '#E0E6F0',
    subtext: '#A0A8B8',
    border: '#2A3A4F',
    icon: '#7D8CA0',
    success: '#67EE7D',
    error: '#EE677D',
    warning: '#EECA67',
    info: '#67A0EE',
    overlay: 'rgba(10, 20, 35, 0.7)',
    tag: {
      background: '#2A3A4F',
      text: '#A0A8B8'
    }
  },
  neon: {
    primary: '#FF00FF', // Magenta
    secondary: '#00FFFF', // Cyan
    background: '#0A0A0A', // Almost black
    card: '#1A1A1A',
    text: '#FFFFFF',
    subtext: '#CCCCCC',
    border: '#333333',
    icon: '#00FF00', // Green
    success: '#00FF00',
    error: '#FF0000',
    warning: '#FFFF00',
    info: '#00FFFF',
    overlay: 'rgba(0, 0, 0, 0.7)',
    tag: {
      background: '#333333',
      text: '#00FFFF'
    }
  },
  forest: {
    primary: '#4CAF50', // Green
    secondary: '#8BC34A', // Light green
    background: '#F1F8E9', // Light green-white
    card: '#E8F5E9',
    text: '#33691E',
    subtext: '#558B2F',
    border: '#C5E1A5',
    icon: '#689F38',
    success: '#388E3C',
    error: '#D32F2F',
    warning: '#FFA000',
    info: '#1976D2',
    overlay: 'rgba(104, 159, 56, 0.5)',
    tag: {
      background: '#DCEDC8',
      text: '#558B2F'
    }
  },
  ocean: {
    primary: '#039BE5', // Blue
    secondary: '#00ACC1', // Cyan
    background: '#E1F5FE', // Light blue
    card: '#E0F7FA',
    text: '#01579B',
    subtext: '#0277BD',
    border: '#B3E5FC',
    icon: '#0288D1',
    success: '#00897B',
    error: '#D32F2F',
    warning: '#FFA000',
    info: '#1976D2',
    overlay: 'rgba(2, 136, 209, 0.5)',
    tag: {
      background: '#B3E5FC',
      text: '#0277BD'
    }
  },
  coffee: {
    primary: '#795548', // Brown
    secondary: '#A1887F', // Light brown
    background: '#EFEBE9', // Light brown-white
    card: '#D7CCC8',
    text: '#3E2723',
    subtext: '#4E342E',
    border: '#BCAAA4',
    icon: '#5D4037',
    success: '#2E7D32',
    error: '#C62828',
    warning: '#FF8F00',
    info: '#1565C0',
    overlay: 'rgba(93, 64, 55, 0.5)',
    tag: {
      background: '#D7CCC8',
      text: '#5D4037'
    }
  }
};

export type ThemeType = 'light' | 'dark' | 'system' | 'sunset' | 'midnight' | 'neon' | 'forest' | 'ocean' | 'coffee';
