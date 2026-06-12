import React from 'react';
import { Stack } from 'expo-router';
import { ConfigProvider } from '../contexts/configContext';

export default function RootLayout() {
  return (
    <ConfigProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ConfigProvider>
  );
}
