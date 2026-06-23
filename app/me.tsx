import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function MeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saya</Text>
      <Text style={styles.subtitle}>Kelola akun, keamanan, trend, dan pengaturan aplikasi</Text>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/profile-security")}>
        <Text style={styles.cardTitle}>Profil dan Keamanan Akun</Text>
        <Text style={styles.cardDesc}>Data pribadi, foto profil, PIN transaksi, dan log out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/trends")}>
        <Text style={styles.cardTitle}>Trend Keuangan Pengguna</Text>
        <Text style={styles.cardDesc}>Grafik pemasukan dan pengeluaran 1, 3, 7, dan 30 hari</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => router.push("/settings")}>
        <Text style={styles.cardTitle}>Pengaturan Sistem</Text>
        <Text style={styles.cardDesc}>Notifikasi, bahasa, dan mode terang/gelap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF8", padding: 20, paddingTop: 55 },
  title: { fontSize: 28, fontWeight: "900", color: "#10231D" },
  subtitle: { color: "#5B6B65", marginTop: 6, marginBottom: 18 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: "#D7E3DD" },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#10231D" },
  cardDesc: { color: "#5B6B65", marginTop: 6 },
  back: { textAlign: "center", marginTop: 12, color: "#0B8F6A", fontWeight: "800" },
});
