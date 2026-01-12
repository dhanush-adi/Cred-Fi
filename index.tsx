// MUST be first - polyfills for Node.js modules
import './polyfills';

import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';

// Choose which app to use based on environment variable
const useSimpleApp = Constants.expoConfig?.extra?.useSimple || process.env.EXPO_PUBLIC_USE_SIMPLE === 'true';

let App;
if (useSimpleApp) {
  console.log('🚀 Loading Integrated App (Smart contract integration with vlayer + Vouch)');
  App = require('./AppIntegrated').default;
} else {
  console.log('🚀 Loading Full App (with Privy)');
  App = require('./App').default;
}

registerRootComponent(App);
