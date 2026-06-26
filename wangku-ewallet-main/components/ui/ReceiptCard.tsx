import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

// Menentukan tipe data yang dibutuhkan oleh Resi WangKu
interface ReceiptProps {
  status: 'success' | 'failed';
  type: 'payment' | 'topup' | 'transfer';
  title: string;
  nominal: number;
  nomorReferensi: string;
  tanggal: string;
}

export default function ReceiptCard({ status, type, title, nominal, nomorReferensi, tanggal }: ReceiptProps) {
  // Format mata uang ke Rupiah secara otomatis
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  const isSuccess = status === 'success';

  return (
    <View style={styles.cardContainer}>
      {/* Bagian Atas: Status Transaksi */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, isSuccess ? styles.badgeSuccess : styles.badgeFailed]}>
          <Text style={[styles.statusText, isSuccess ? styles.textSuccess : styles.textFailed]}>
            {isSuccess ? 'Sukses' : 'Gagal'}
          </Text>
        </View>
        <Text style={styles.titleText}>
          {type === 'topup' ? 'Top Up Saldo Berhasil' : 'Pembayaran Berhasil'}
        </Text>
        <Text style={styles.amountText}>
          {type === 'topup' ? '+' : '-'}{formatRupiah(nominal)}
        </Text>
      </View>

      {/* Garis Putus-putus Pemisah Resi */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
      </View>

      {/* Bagian Bawah: Detail Info Transaksi */}
      <View style={styles.detailContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Transaksi</Text>
          <Text style={styles.value} numberOfLines={1}>{title}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Jenis Layanan</Text>
          <Text style={styles.value}>{type === 'topup' ? 'Top Up Saldo' : 'Merchant/Product'}</Text>
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
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignSelf: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#E6ECE9',
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
    backgroundColor: '#E8F7F1', // Hijau muda khas WangKu
  },
  badgeFailed: {
    backgroundColor: '#FCEAEA', // Merah muda khas WangKu
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  textSuccess: {
    color: '#0B8F6A', // Hijau tua WangKu
  },
  textFailed: {
    color: '#C23B3B', // Merah tua WangKu
  },
  titleText: {
    fontSize: 14,
    color: '#60716B',
    marginBottom: 6,
    fontWeight: '500',
  },
  amountText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10231D',
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
    borderColor: '#E6ECE9',
    borderStyle: 'dashed',
  },
  detailContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#60716B',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#243B33',
    maxWidth: '60%',
  },
  valueCopy: {
    fontSize: 12,
    color: '#0B8F6A', // Menggunakan warna dasar brand WangKu (Hijau)
    fontWeight: 'bold',
  },
});