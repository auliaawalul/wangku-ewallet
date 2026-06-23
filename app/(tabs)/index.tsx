import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { UserProfile, WalletTransaction } from "../../types";
import { formatRupiah } from "../../utils/format";

export default function DashboardScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    const user = auth.currentUser;

    if (!user) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    const userSnap = await getDoc(doc(db, "users", user.uid));

    if (userSnap.exists()) {
      setProfile(userSnap.data() as UserProfile);
    }

    const trxQuery = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid)
    );
    const trxSnap = await getDocs(trxQuery);
    const result: WalletTransaction[] = [];

    trxSnap.forEach((item) => {
      result.push({ id: item.id, ...(item.data() as WalletTransaction) });
    });

    result.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.()?.getTime?.() || 0;
      const dateB = b.createdAt?.toDate?.()?.getTime?.() || 0;
      return dateB - dateA;
    });

    setTransactions(result.slice(0, 3));
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0B8F6A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Halo, {profile?.name || "Pengguna"}</Text>
      <Text style={styles.subtitle}>Selamat datang di WangKu</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo WangKu</Text>
        <Text style={styles.balanceText}>{formatRupiah(profile?.balance || 0)}</Text>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/topup")}>
          <Text style={styles.menuText}>Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/pay")}>
          <Text style={styles.menuText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/history")}>
          <Text style={styles.menuText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.push("/me")}>
          <Text style={styles.menuText}>Saya</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Transaksi Terbaru</Text>
      {transactions.length === 0 ? (
        <Text style={styles.empty}>Belum ada transaksi</Text>
      ) : (
        transactions.map((item) => (
          <View key={item.id} style={styles.trxCard}>
            <Text style={styles.trxTitle}>{item.title}</Text>
            <Text style={item.type === "topup" ? styles.income : styles.expense}>
              {item.type === "topup" ? "+" : "-"} {formatRupiah(item.amount)}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF8", padding: 20, paddingTop: 55 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  greeting: { fontSize: 26, fontWeight: "900", color: "#10231D" },
  subtitle: { color: "#5B6B65", marginTop: 4 },
  balanceCard: { backgroundColor: "#0B8F6A", borderRadius: 20, padding: 22, marginTop: 20 },
  balanceLabel: { color: "#DDF7EF", fontSize: 14 },
  balanceText: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", marginTop: 6 },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 },
  menuButton: { width: "47%", backgroundColor: "#FFFFFF", padding: 18, borderRadius: 16, borderWidth: 1, borderColor: "#D7E3DD" },
  menuText: { color: "#0B8F6A", fontWeight: "800", textAlign: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "900", marginTop: 24, marginBottom: 10, color: "#10231D" },
  empty: { color: "#5B6B65" },
  trxCard: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: "#E2EAE6" },
  trxTitle: { color: "#10231D", fontWeight: "700" },
  income: { color: "#0B8F6A", marginTop: 4, fontWeight: "900" },
  expense: { color: "#C23B3B", marginTop: 4, fontWeight: "900" },
});
