import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useLanguage } from '../LanguageContext'; // 👈 Hubungkan ke Pusat Bahasa

export default function TabLayout() {
  const { t } = useLanguage(); // 👈 Ambil kamus bahasa

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0A9396',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: Platform.OS === 'ios' ? 90 : 68,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      {/* 1. Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: t.welcome.includes('Welcome') ? 'Dashboard' : 'Dashboard', // Bisa disesuaikan jika mau diganti teksnya
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
        }}
      />

      {/* 2. Riwayat */}
      <Tabs.Screen
        name="history"
        options={{
          title: t.cancel === 'Cancel' ? 'History' : 'Riwayat', // 👈 Otomatis Berubah EN/ID
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "time" : "time-outline"} size={22} color={color} />
          ),
        }}
      />

      {/* 3. Pengaturan */}
      <Tabs.Screen
        name="settings"
        options={{
          title: t.settingsTitle, // 👈 Otomatis Berubah EN/ID
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "settings" : "settings-outline"} size={22} color={color} />
          ),
        }}
      />

      {/* 4. Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t.cancel === 'Cancel' ? 'Profile' : 'Profil', // 👈 Otomatis Berubah EN/ID
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}