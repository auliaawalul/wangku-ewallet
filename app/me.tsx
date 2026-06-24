import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 👈 1. Import useRouter di paling atas
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from './LanguageContext'; // 👈 Pastikan pusat bahasa terhubung

export default function MeScreen() {
  const router = useRouter(); // 👈 2. Inisialisasi router di dalam fungsi
  const { t } = useLanguage();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* --- BAGIAN HEADER / FOTO PROFIL BISA DI SINI --- */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={50} color="#0A9396" />
        </View>
        <Text style={styles.userName}>Putri Aulia</Text>
        <Text style={styles.userPhone}>+62 812-3456-7890</Text>
      </View>

      {/* --- MENU PILIHAN --- */}
      <View style={styles.menuContainer}>
        
        {/* TOMBOL MENU KEAMANAN (SECURITY) */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('/profile-security')} // 👈 3. Navigasi ke keamanan
        >
          <View style={styles.menuLeft}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#0A9396" />
            <Text style={styles.menuText}>Keamanan Akun</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* Kamu bisa tambah menu lain di bawahnya seperti Bantuan, dll */}
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E6F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  userPhone: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 14,
  },
});