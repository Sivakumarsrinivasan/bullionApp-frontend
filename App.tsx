import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import AppNavigator from './src/navigations/AppNavigator';
import {ThemeProvider} from './src/theme/ThemeProvider';
import Toast from 'react-native-toast-message';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
        <Toast/>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;