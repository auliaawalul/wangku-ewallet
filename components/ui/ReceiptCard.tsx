import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

interface ReceiptProps {
  status: 'success' | 'failed';
  type: 'payment' | 'topup' | 'transfer';
  title: string;
  nominal: number;
  nomorReferensi: string;
  tanggal: string;
}

export default function ReceiptCard({ status, type, title, nominal, nomorReferensi, tanggal }: ReceiptProps) {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const isSuccess = status === 'success';

  return (
    <View style={styles.cardContainer}>
      {/* Efek Garis Dekoratif Atas ala FinTech */}
      <View style={[styles.topBar, isSuccess ? styles.barSuccess : styles.barFailed]} />

      <View style={styles.header}>
        <View style={[styles.statusBadge, isSuccess ? styles.badgeSuccess : styles.badgeFailed]}>
          <Text style={[styles.statusText, isSuccess ? styles.textSuccess : styles.textFailed]}>
            {isSuccess ? '✓ Sukses' : '✕ Gagal'}
          </Text>
        </View>
        <Text style={styles.titleText}>
          {type === 'topup' ? 'Top Up Saldo WangKu' : 'Total Pembayaran'}
        </Text>
        <Text style={styles.amountText}>
          {type === 'topup' ? '+' : '-'}{formatRupiah(nominal)}
        </Text>
      </View>

      {/* Pembatas Resi Estetik (Garis Putus-Putus) */}
      <View style={styles.dividerContainer}>
        <View style={styles.notchLeft} />
        <View style={styles.line} />
        <View style={styles.notchRight} />
      </View>

      <View style={styles.detailContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Layanan</Text>
          <Text style={styles.value} numberOfLines={1}>{title}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Metode</Text>
          <Text style={styles.value}>Saldo WangKu</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Waktu Transaksi</Text>
          <Text style={styles.value}>{tanggal}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>No. Referensi</Text>
          <Text style={styles.valueCopy}>{nomorReferensi}</Text>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    width: width * 0.88,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    shadowColor: '#3B82F6', // Menggunakan bayangan biru lembut dari logo
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 6,
    alignSelf: 'center',
    marginVertical: 15,
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  barSuccess: { backgroundColor: '#06B6D4' }, // Warna toska WangKu
  barFailed: { backgroundColor: '#EF4444' },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeSuccess: { backgroundColor: '#E0F2FE' },
  badgeFailed: { backgroundColor: '#FEE2E2' },
  statusText: { fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  textSuccess: { color: '#0284C7' },
  textFailed: { color: '#DC2626' },
  titleText: { fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: '500' },
  amountText: { fontSize: 30, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5 },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  line: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginHorizontal: 12,
  },
  // Efek potongan tiket di kanan kiri resi biar unik
  notchLeft: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F8FAFC', marginLeft: -7 },
  notchRight: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#F8FAFC', marginRight: -7 },
  detailContainer: { paddingHorizontal: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
  label: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  value: { fontSize: 14, fontWeight: '700', color: '#1E293B', maxWidth: '60%' },
  valueCopy: { fontSize: 13, color: '#06B6D4', fontWeight: '800' },
});