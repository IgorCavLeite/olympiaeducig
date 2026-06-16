import React from 'react';
import { Stack } from 'expo-router';
import { ConfigProvider } from '../contexts/configContext';
import { StatusBar } from 'expo-status-bar';

import '../i18n';

export default function RootLayout() {
  return (
    <ConfigProvider>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </ConfigProvider>
  );
}
