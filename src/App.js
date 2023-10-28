import React, { useEffect } from 'react';
import { LogBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AppNavigation from './screens/AppNavigation';
import ScreenLoading from './components/ScreenLoading';

const App = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar backgroundColor="#F2F2F2" barStyle="light-content" />
        <AppNavigation />
        <ScreenLoading />
      </PersistGate>
    </Provider>
  );
}

export default App;
