import { FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // 👈 Tambahan modul Firestore
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase/firebaseConfig'; // 👈 Pastikan path db kamu sudah benar
import { formatRupiah } from '../../utils/format'; // 👈 Impor utilitas format rupiah agar rapi
import { useLanguage } from '../LanguageContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t } = useLanguage(); 
  const [displayName, setDisplayName] = useState('User');
  const [balance, setBalance] = useState<number>(0); // 👈 State dinamis untuk menyimpan nilai saldo

  useEffect(() => {
    const auth = getAuth();
    let unsubscribeSnapshot: () => void;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 1. Logika Pengaturan Nama Tampilan
        if (user.displayName) {
          const firstName = user.displayName.split(' ')[0];
          setDisplayName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
        } else if (user.email) {
          const nameFromEmail = user.email.split('@')[0];
          setDisplayName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
        } else {
          setDisplayName('User');
        }

        // 2. Logika Sinkronisasi Saldo Real-Time dari Firestore
        const userRef = doc(db, "users", user.uid);
        unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            // Ambil field balance dari database, jika belum ada set ke angka 0
            setBalance(userData.balance || 0); 
          }
        }, (error) => {
          console.log("DASHBOARD SNAPSHOT ERROR:", error.message);
        });

      } else {
        setDisplayName('User');
        setBalance(0);
      }
    });

    // Bersihkan semua listener saat user logout atau keluar dari screen
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Header Premium */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>{t.welcome}</Text> 
          <Text style={styles.userName}>Halo, {displayName}!</Text>
        </View>
        <TouchableOpacity style={styles.notificationBadge}>
          <Ionicons name="notifications-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* Card Saldo Minimalis Modern */}
      <View style={styles.balanceCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.balanceTitle}>{t.balance}</Text> 
          <TouchableOpacity>
            <Ionicons name="eye-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {/* 👈 SEKARANG SALDO SUDAH DINAMIS MENGGUNAKAN FORMAT RUPIAH */}
        <Text style={styles.balanceAmount}>{formatRupiah(balance)}</Text>
        
        <View style={styles.accountNumberRow}>
          <Text style={styles.accountNumber}>0550773458</Text>
          <TouchableOpacity style={styles.copyButton}>
            <Ionicons name="copy-outline" size={14} color="#CCFBF1" />
            <Text style={styles.copyText}>Salin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Menu Utama - 4 Fitur Aktif Tersambung */}
      <View style={styles.menuGrid}>
        {/* 1. Tombol Transfer */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/transfer')}>
          <View style={[styles.iconWrapper, { backgroundColor: '#E0F2FE' }]}>
            <FontAwesome6 name="arrow-transfer-between-lines" size={18} color="#0284C7" />
          </View>
          <Text style={styles.menuLabel}>{t.transferBtn}</Text>
        </TouchableOpacity>

        {/* 2. Tombol Top Up */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/topup')}>
          <View style={[styles.iconWrapper, { backgroundColor: '#E0F2F1' }]}>
            <MaterialCommunityIcons name="wallet-plus-outline" size={22} color="#0F766E" />
          </View>
          <Text style={styles.menuLabel}>{t.topupBtn}</Text>
        </TouchableOpacity>

        {/* 3. Tombol Pembayaran */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/pay')}>
          <View style={[styles.iconWrapper, { backgroundColor: '#F3E8FF' }]}>
            <MaterialIcons name="payment" size={22} color="#7E22CE" />
          </View>
          <Text style={styles.menuLabel}>{t.payBtn}</Text> 
        </TouchableOpacity>

        {/* 4. Tombol Modal Bantuan */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/modal')}>
          <View style={[styles.iconWrapper, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="help-circle-outline" size={24} color="#D97706" />
          </View>
          <Text style={styles.menuLabel}>{t.modalBtn}</Text> 
        </TouchableOpacity>
      </View>

      {/* Informasi Transaksi Terbaru */}
      <View style={styles.transactionSection}>
        <Text style={styles.sectionTitle}>{t.historyTitle}</Text> 
        <View style={styles.emptyTransactionBox}>
          <Ionicons name="receipt-outline" size={32} color="#94A3B8" style={{ marginBottom: 8 }} />
          <Text style={styles.emptyText}>Belum ada transaksi masuk atau keluar.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
  },
  notificationBadge: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  balanceCard: {
    backgroundColor: '#0A9396',
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#0A9396',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    color: '#CCFBF1',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 28, // Sedikit dikecilkan dari 36 agar nominal panjang tidak memotong layar
    fontWeight: 'bold',
    marginBottom: 16,
  },
  accountNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountNumber: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
    marginRight: 12,
    opacity: 0.9,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  copyText: {
    color: '#CCFBF1',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 24,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItem: {
    alignItems: 'center',
    width: (width - 64) / 4,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
  transactionSection: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 14,
  },
  emptyTransactionBox: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 32,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
});