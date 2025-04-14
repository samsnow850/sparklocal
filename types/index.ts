import { User as FirebaseUser } from 'firebase/auth';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
  isAnonymous?: boolean;
  metadata?: any;
  providerData?: any[];
  refreshToken?: string;
  tenantId?: string | null;
  delete?: () => Promise<void>;
  getIdToken?: (forceRefresh?: boolean) => Promise<string>;
  getIdTokenResult?: (forceRefresh?: boolean) => Promise<any>;
  reload?: () => Promise<void>;
  toJSON?: () => object;
}

export interface DateIdea {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  price: string;
  duration: string;
  vibes: string[];
  weatherSuitability: string[];
  externalLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherCondition {
  main: string;
  description: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  icon: string; // Added icon property
}

export interface SearchFilters {
  query: string;
  location: string;
  price: string[];
  duration: string[];
  vibes: string[];
  mapView: boolean;
}

export interface AppSettings {
  theme: string;
  notifications: boolean;
  language: 'en' | 'es';
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
  };
  safety?: {
    safetyAlerts: boolean;
    locationSharing: boolean;
    emergencyContacts: string[];
  };
  dataManagement?: {
    autoSync: boolean;
    offlineMode: boolean;
  };
  experimental?: {
    animatedReactions: boolean;
    aiAssistant: boolean;
    achievements: boolean;
    personalityTest: boolean;
    premium: boolean;
    debugMode: boolean;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  total?: number;
  isUnlocked: boolean;
}

export interface DateFeedback {
  dateIdeaId: string;
  rating: number;
  review?: string;
  photos?: string[];
  tags?: string[];
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
}

export interface PersonalityTrait {
  id: string;
  name: string;
  score: number;
  description: string;
}

export interface PersonalityResult {
  traits: PersonalityTrait[];
  dateTypes: string[];
  recommendedIdeas: string[];
  createdAt: string;
}
