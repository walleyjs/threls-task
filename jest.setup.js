import '@testing-library/jest-native/extend-expect';

// Mock the expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock the expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      apiUrl: 'https://pawlus.twinepos.dev/api/online/v1',
    },
  },
}));

// Mock the expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock the expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
})); 