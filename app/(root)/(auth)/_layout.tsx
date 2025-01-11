import React from 'react';
import { Stack } from 'expo-router';


// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function Layout() {
  return (
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack>
  );
}
