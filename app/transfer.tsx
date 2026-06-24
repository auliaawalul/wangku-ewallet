import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase/firebaseConfig';
import { useLanguage } from './LanguageContext';

export default function TransferScreen() {
  const { t } = useLanguage(); 
  const [recipientUid, setRecipientUid] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    const user = auth.currentUser;
    const transferAmount = Number(amount);

    if (!user) {
      Alert.alert(t.cancel === 'Cancel' ? 'Error' : 'Gagal', 'Silakan login terlebih dahulu');
      return;
    }

    if (!recipientUid.trim()) {
      Alert.alert(t.cancel === 'Cancel' ? 'Warning' : 'Peringatan', t.cancel === 'Cancel' ? 'Please enter destination UID' : 'Masukkan UID tujuan transfer');
      return;
    }

    if (recipientUid.trim() === user.uid) {
      Alert.alert(t.cancel === 'Cancel' ? 'Warning' : 'Peringatan', t.cancel === 'Cancel' ? 'Cannot transfer to yourself' : 'Tidak bisa transfer ke akun sendiri');
      return;
    }

    if (!transferAmount || transferAmount <= 0) {
      Alert.alert(t.cancel === 'Cancel' ? 'Warning' : 'Peringatan', t.cancel === 'Cancel' ? 'Enter a valid amount' : 'Masukkan nominal transfer yang valid');
      return;
    }

    setLoading(true);

    try {
      const senderRef = doc(db, "users", user.uid);
      const recipientRef = doc(db, "users", recipientUid.trim());

      // Eksekusi transaksi atomik
      await runTransaction(db, async (transaction) => {
        const senderSnap = await transaction.get(senderRef);
        const recipientSnap = await transaction.get(recipientRef);

        if (!senderSnap.exists()) {
          throw new Error("Pengirim tidak ditemukan");
        }
        
        // 👈 MODIFIKASI: Jika akun target terdaftar di sistem Auth/Database tapi data balance kosong, set default ke 0
        if (!recipientSnap.exists()) {
          throw new Error("Penerima tidak ditemukan");
        }

        const senderBalance = senderSnap.data().balance || 0;
        const recipientBalance = recipientSnap.data().balance || 0;

        if (senderBalance < transferAmount) {
          throw new Error("Saldo tidak mencukupi");
        }

        // 1. Kurangi Saldo Pengirim
        transaction.update(senderRef, { balance: senderBalance - transferAmount });

        // 2. Tambah Saldo Penerima
        transaction.update(recipientRef, { balance: recipientBalance + transferAmount });

        // 3. Catat Riwayat Transaksi ke Firestore
        const transactionDocRef = doc(collection(db, "transactions"));
        transaction.set(transactionDocRef, {
          uid: user.uid,
          recipientUid: recipientUid.trim(),
          type: "transfer",
          title: t.cancel === 'Cancel' ? `Transfer to ${recipientUid.trim().substring(0, 5)}...` : `Transfer ke ${recipientUid.trim().substring(0, 5)}...`,
          amount: transferAmount,
          note: note,
          status: "success",
          createdAt: serverTimestamp(),
        });
      });

      Alert.alert(t.cancel === 'Cancel' ? 'Success' : 'Berhasil', t.transferSuccess);
      
      // Amankan pembersihan state setelah navigasi mundur dipicu
      router.back();
      setTimeout(() => {
        setAmount('');
        setRecipientUid('');
        setNote('');
      }, 500);

    } catch (error: any) {
      console.log("TRANSFER ERROR:", error);
      const errorMsg = error.message === "Penerima tidak ditemukan" 
        ? (t.cancel === 'Cancel' ? 'Destination account not found' : 'UID akun tujuan tidak ditemukan!')
        : error.message === "Saldo tidak mencukupi"
        ? (t.cancel === 'Cancel' ? 'Insufficient balance' : 'Saldo Anda tidak mencukupi!')
        : t.transferFailed;

      Alert.alert(t.cancel === 'Cancel' ? 'Failed' : 'Gagal', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Premium */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.transferTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Form UID Tujuan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.transferDest}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contoh: uX892Jb..."
              placeholderTextColor="#94A3B8"
              value={recipientUid}
              onChangeText={setRecipientUid}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Form Nominal */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.transferAmount}</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencyPrefix}>Rp</Text>
            <TextInput
              style={[styles.input, { fontSize: 18, fontWeight: 'bold' }]}
              placeholder="0"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              value={amount}
              onChangeText={(val) => setAmount(val.replace(/[^0-9]/g, ''))}
            />
          </View>
        </View>

        {/* Form Catatan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t.transferNote}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="document-text-outline" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Uang jajan / bayar kas"
              placeholderTextColor="#94A3B8"
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>
      </ScrollView>

      {/* Tombol Kirim */}
      <TouchableOpacity 
        style={[styles.button, loading && { opacity: 0.6 }]} 
        onPress={handleTransfer}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? (t.cancel === 'Cancel' ? 'Processing...' : 'Memproses...') : t.transferProcess}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 45,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  scrollContent: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: {
    marginRight: 10,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  button: {
    margin: 24,
    backgroundColor: '#0A9396',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#0A9396',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});