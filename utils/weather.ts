import { WeatherCondition } from '@/types';

const API_KEY = '4862d5e067388e783d46e5265ed1c203';

// Function to fetch weather data from OpenWeather API
export const fetchWeather = async (location: string = 'San Francisco'): Promise<WeatherCondition> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather data fetch failed for ${location}`);
    }

    const data = await response.json();

    const weather: WeatherCondition = {
      main: data.weather[0].main,
      description: data.weather[0].description,
      temp: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    };

    return weather;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      main: 'Unknown',
      description: 'Unable to fetch data',
      temp: 0,
      humidity: 0,
      windSpeed: 0,
      icon: '01d',
    };
  }
};

// Get weather emoji based on condition
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

// Get Lucide weather icon name
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

// Weather recommendation
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

// Date ideas based on weather
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
