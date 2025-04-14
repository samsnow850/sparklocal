import { User } from '@/types';

// Mock Firebase authentication functions for demo purposes
// In a real app, these would use the actual Firebase SDK

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({
          uid: '123456',
          email: email,
          displayName: 'Demo User',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: "",
          tenantId: null
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

export const signInWithGoogle = async (): Promise<User> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        uid: '789012',
        email: 'google@example.com',
        displayName: 'Google User',
        photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: "",
        tenantId: null
      });
    }, 1000);
  });
};

export const createUserWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve({
          uid: '345678',
          email: email,
          displayName: null,
          photoURL: null,
          emailVerified: false,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: "",
          tenantId: null
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

export const updateUserProfile = async (user: User, profile: { displayName?: string; photoURL?: string }): Promise<User> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedUser = {
        ...user,
        ...profile
      };
      resolve(updatedUser);
    }, 1000);
  });
};

export const signOut = async (): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

export const resetPassword = async (email: string): Promise<void> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email) {
        resolve();
      } else {
        reject(new Error('Email is required'));
      }
    }, 1000);
  });
};

// This function is not needed since we're not using real Firebase
// but would be used in a real app to listen for auth state changes
export const subscribeToAuthChanges = (callback: (user: User | null) => void): () => void => {
  // Return an unsubscribe function
  return () => {};
};
