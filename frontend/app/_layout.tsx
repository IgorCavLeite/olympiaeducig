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
    </ConfigProvider>
  );
}
