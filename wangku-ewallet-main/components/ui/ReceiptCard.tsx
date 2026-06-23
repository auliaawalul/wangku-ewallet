import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Menentukan tipe data yang dibutuhkan oleh Resi
interface ReceiptProps {
  status: 'Sukses' | 'Gagal';
  nominal: number;
  penerima: string;
  bankTujuan: string;
  nomorReferensi: string;
  tanggal: string;
}

export default function ReceiptCard({ status, nominal, penerima, bankTujuan, nomorReferensi, tanggal }: ReceiptProps) {
  // Format mata uang ke Rupiah secara otomatis
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <View style={styles.cardContainer}>
      {/* Bagian Atas: Status Transaksi */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, status === 'Sukses' ? styles.badgeSuccess : styles.badgeFailed]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={styles.titleText}>Transfer Berhasil</Text>
        <Text style={styles.amountText}>{formatRupiah(nominal)}</Text>
      </View>

      {/* Garis Putus-putus Pemisah Resi */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
      </View>

      {/* Bagian Bawah: Detail Info Transfer */}
      <View style={styles.detailContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Penerima</Text>
          <Text style={styles.value}>{penerima}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Bank Tujuan</Text>
          <Text style={styles.value}>{bankTujuan}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Waktu</Text>
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
    width: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
  },
  badgeFailed: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    color: '#16A34A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 6,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  detailContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#64748B',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  valueCopy: {
    fontSize: 12,
    color: '#0A4D92', // Menggunakan warna dasar brand Wangku (Biru)
    fontWeight: 'bold',
  },
});