# Threls E-commerce App

A modern e-commerce application built with React Native and Expo, featuring a responsive design for both mobile and web platforms.

## Setup Instructions

1. **Prerequisites**
   - Node.js (v18 or higher)
   - npm or yarn
   - Expo CLI (`npm install -g expo-cli`)

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd threls-task

   # Install dependencies
   npm install

   # Start the development server
   npm start
   ```

3. **Running the App**
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

4. **Running Tests**
   ```bash
   npm test
   ```

## Architectural Decisions

### 1. Technology Stack
- **Framework**: React Native with Expo for cross-platform development
- **Navigation**: Expo Router for file-based routing
- **Styling**: React Native StyleSheet with a custom theming system
- **State Management**: React Context API with useReducer for cart functionality
- **Image Handling**: Expo Image for optimized image loading and caching
- **Testing**: Jest and React Native Testing Library

### 2. Project Structure
```
├── app/                 # Main application screens
├── components/         # Reusable components
│   ├── ui/            # UI components
│   └── ...            # Feature-specific components
├── constants/         # App constants and theme
├── services/          # API and business logic
├── __tests__/        # Test files
└── assets/           # Static assets
```

### 3. Performance Optimizations
- Lazy loading for all pages using React Suspense
- Optimized image loading with Expo Image
- Responsive design for both mobile and web platforms
- Efficient state management with Context API

### 4. Lazy Loading Implementation
- Each page is wrapped in a Suspense boundary
- Custom LoadingScreen component for consistent loading states
- Lazy loading configuration in Expo Router
- Optimized initial bundle size

## State Management

### Cart State
- Implemented using React Context API and useReducer
- Provides global cart state management
- Actions:
  - ADD_ITEM: Add product to cart
  - REMOVE_ITEM: Remove product from cart
  - UPDATE_QUANTITY: Update product quantity
  - CLEAR_CART: Clear all items

### Error Handling
- Form validation in checkout process
- Error boundaries for component-level error handling
- Loading states for async operations
- Graceful fallbacks for failed image loads

## Testing Strategy

### Unit Tests
- Component testing with React Native Testing Library
- Cart functionality testing
- Form validation testing
- State management testing

### Test Configuration
- Jest as the test runner
- React Native Testing Library for component testing
- Custom test utilities and mocks
- CI/CD integration ready

## Known Limitations

1. **State Persistence**
   - Cart state is not persisted between sessions
   - No offline support for cart data

2. **Performance**
   - Large product images may impact initial load time
   - No image optimization for different screen sizes

3. **Features**
   - Limited payment gateway integration
   - No user authentication system
   - No wishlist persistence

4. **Testing**
   - Limited E2E test coverage
   - No performance testing
   - No visual regression testing

## Areas for Improvement

1. **State Management**
   - Implement persistent storage for cart data
   - Add user authentication and profile management
   - Implement wishlist functionality

2. **Performance**
   - Add image optimization for different screen sizes
   - Implement caching for product data
   - Add offline support

3. **Features**
   - Add search functionality
   - Implement product filtering and sorting
   - Add user reviews and ratings
   - Implement order tracking

4. **Testing**
   - Add performance testing
   - Increase test coverage
   - Unit tests


