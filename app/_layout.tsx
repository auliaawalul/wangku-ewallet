import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="index" />
      <Stack.Screen name="pay" />
      <Stack.Screen name="topup" />
      <Stack.Screen name="history" />
      <Stack.Screen name="me" />
      <Stack.Screen name="profile-security" />
      <Stack.Screen name="trends" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}