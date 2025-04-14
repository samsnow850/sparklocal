import { WeatherCondition } from '@/types';

// Mock weather data for different locations
const mockWeatherData: Record<string, WeatherCondition> = {
  default: {
    main: 'Clear',
    description: 'clear sky',
    temp: 22,
    humidity: 60,
    windSpeed: 5,
    icon: '01d'
  },
  'San Francisco': {
    main: 'Clouds',
    description: 'scattered clouds',
    temp: 18,
    humidity: 75,
    windSpeed: 8,
    icon: '03d'
  },
  'Oakland': {
    main: 'Clear',
    description: 'clear sky',
    temp: 20,
    humidity: 65,
    windSpeed: 6,
    icon: '01d'
  },
  'Berkeley': {
    main: 'Mist',
    description: 'light mist',
    temp: 17,
    humidity: 80,
    windSpeed: 4,
    icon: '50d'
  },
  'Sausalito': {
    main: 'Clouds',
    description: 'broken clouds',
    temp: 16,
    humidity: 85,
    windSpeed: 10,
    icon: '04d'
  },
  'Palo Alto': {
    main: 'Clear',
    description: 'clear sky',
    temp: 23,
    humidity: 55,
    windSpeed: 3,
    icon: '01d'
  }
};

// Function to fetch weather data
export const fetchWeather = async (location: string = 'San Francisco'): Promise<WeatherCondition> => {
  // In a real app, we would make an API call to a weather service
  // For this demo, we'll use mock data
  
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Return mock data for the specified location or default
      resolve(mockWeatherData[location] || mockWeatherData.default);
    }, 500);
  });
};

// Function to get weather emoji based on weather condition
export const getWeatherEmoji = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return '☀️';
    case 'clouds':
      return '☁️';
    case 'rain':
      return '🌧️';
    case 'drizzle':
      return '🌦️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'mist':
    case 'fog':
      return '🌫️';
    default:
      return '🌤️';
  }
};

// Function to get weather icon name for Lucide icons
export const getWeatherIcon = (condition: string): string => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return 'sun';
    case 'clouds':
      return 'cloud';
    case 'rain':
      return 'cloud-rain';
    case 'drizzle':
      return 'cloud-drizzle';
    case 'thunderstorm':
      return 'cloud-lightning';
    case 'snow':
      return 'cloud-snow';
    case 'mist':
    case 'fog':
      return 'cloud-fog';
    default:
      return 'cloud-sun';
  }
};

// Function to get weather recommendation
export const getWeatherRecommendation = (weather: WeatherCondition): string => {
  if (weather.main === 'Clear' && weather.temp > 20) {
    return "Perfect weather for outdoor activities!";
  } else if (weather.main === 'Clear' && weather.temp <= 20) {
    return "Nice day, but bring a light jacket.";
  } else if (weather.main === 'Clouds') {
    return "Partly cloudy, good for most outdoor activities.";
  } else if (weather.main === 'Rain' || weather.main === 'Drizzle') {
    return "Rainy day, consider indoor activities.";
  } else if (weather.main === 'Thunderstorm') {
    return "Stormy weather, best to stay indoors.";
  } else if (weather.main === 'Snow') {
    return "Snowy day, perfect for winter activities.";
  } else {
    return "Check the weather before heading out.";
  }
};

// Function to get suitable date ideas based on weather
export const getSuitableDateIdeas = (weather: WeatherCondition): string[] => {
  if (weather.main === 'Clear' && weather.temp > 20) {
    return ['Picnic', 'Beach', 'Hiking', 'Outdoor Dining'];
  } else if (weather.main === 'Clear' && weather.temp <= 20) {
    return ['Park Walk', 'Outdoor Cafe', 'Botanical Garden', 'Farmers Market'];
  } else if (weather.main === 'Clouds') {
    return ['Museum', 'Shopping', 'Brewery Tour', 'Scenic Drive'];
  } else if (weather.main === 'Rain' || weather.main === 'Drizzle') {
    return ['Movie Theater', 'Indoor Restaurant', 'Art Gallery', 'Cooking Class'];
  } else if (weather.main === 'Thunderstorm') {
    return ['Stay In Movie', 'Board Games', 'Indoor Restaurant', 'Spa Day'];
  } else if (weather.main === 'Snow') {
    return ['Ice Skating', 'Hot Chocolate Cafe', 'Ski Resort', 'Cozy Cabin'];
  } else {
    return ['Museum', 'Indoor Restaurant', 'Shopping', 'Cafe Hopping'];
  }
};
