import React, { useEffect } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppState, Platform } from 'react-native';
import { changeIcon, resetIcon } from 'react-native-change-icon';

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active') {
        // App is in the foreground, set the main icon
        await changeIcon('Dark'); // Replace 'DarkIcon' with your main icon name
      } else if (nextAppState === 'background') {
        // App is in the background, set the default icon
        await resetIcon();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }
  }, []);
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HomeScreen />
    </GestureHandlerRootView>
    
  );
};

export default App;