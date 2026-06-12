<<<<<<< HEAD
import React from 'react';
import { Stack } from 'expo-router';
import { ConfigProvider } from '../contexts/configContext';

export default function RootLayout() {
  return (
    <ConfigProvider>
      <Stack screenOptions={{ headerShown: false }} />
=======
import { Stack } from 'expo-router';
import { ConfigProvider } from '../contexts/ConfigContext';

import '../i18n';

export default function Layout() {
  return (
    <ConfigProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
>>>>>>> 6c53f0bd9cf5e03109b7fb61d370ab7a4ea596ce
    </ConfigProvider>
  );
}
