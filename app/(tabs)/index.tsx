import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "D:/expo_mobcomp/wangku-ewallet/firebase/firebaseConfig";

type Transaction = {
  id: string;
  type: "topup" | "payment" | "transfer";
  title: string;
  amount: number;
  status: string;
  createdAt?: any;
};

export default function DashboardScreen() {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const loadDashboard = useCallback(async () => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    try {
      setLoading(true);

      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (userSnap.exists()) {
        setName(userSnap.data().name || "Pengguna");
        setBalance(userSnap.data().balance || 0);
      }

      const transactionQuery = query(
        collection(db, "transactions"),
        where("uid", "==", user.uid)
      );
      const transactionSnap = await getDocs(transactionQuery);

      const result: Transaction[] = transactionSnap.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Transaction, "id">),
      }));

      result.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      setTransactions(result.slice(0, 3));
    } catch (error) {
      Alert.alert("Error", "Data dashboard gagal dimuat");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0B8F6A" />
        <Text style={styles.loadingText}>Memuat dompet...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo WangKu</Text>
        <Text style={styles.balanceValue}>{formatRupiah(balance)}</Text>
        <Text style={styles.balanceHint}>Saldo aktif dan siap digunakan</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.action} onPress={() => router.push("/topup")}>
          <Text style={styles.actionIcon}>+</Text>
          <Text style={styles.actionText}>Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={() => router.push("/pay")}>
          <Text style={styles.actionIcon}>Rp</Text>
          <Text style={styles.actionText}>Pay</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={() => router.push("/history")}>
          <Text style={styles.actionIcon}>H</Text>
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transaksi terbaru</Text>
        <TouchableOpacity onPress={() => router.push("/history")}>
          <Text style={styles.seeAll}>Lihat semua</Text>
        </TouchableOpacity>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Belum ada transaksi</Text>
        </View>
      ) : (
        transactions.map((item) => {
          const isTopUp = item.type === "topup";

          return (
            <View key={item.id} style={styles.transactionCard}>
              <View style={[styles.transactionIcon, isTopUp && styles.incomingIcon]}>
                <Text style={styles.transactionIconText}>{isTopUp ? "+" : "-"}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.transactionStatus}>{item.status}</Text>
              </View>
              <Text style={[styles.amount, isTopUp ? styles.incoming : styles.outgoing]}>
                {isTopUp ? "+" : "-"}{formatRupiah(item.amount)}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FAF8",
  },
  content: {
    padding: 20,
    paddingTop: 52,
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6FAF8",
  },
  loadingText: {
    marginTop: 10,
    color: "#60716B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: {
    color: "#60716B",
    fontSize: 14,
  },
  name: {
    color: "#10231D",
    fontSize: 24,
    fontWeight: "800",
  },
  logout: {
    color: "#C23B3B",
    fontWeight: "700",
  },
  balanceCard: {
    marginTop: 22,
    backgroundColor: "#0B8F6A",
    borderRadius: 8,
    padding: 22,
  },
  balanceLabel: {
    color: "#D8F4EA",
    fontSize: 14,
  },
  balanceValue: {
    marginTop: 6,
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "800",
  },
  balanceHint: {
    marginTop: 16,
    color: "#C9EDDF",
    fontSize: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  action: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2EAE6",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionIcon: {
    color: "#0B8F6A",
    fontSize: 18,
    fontWeight: "800",
  },
  actionText: {
    marginTop: 5,
    color: "#243B33",
    fontSize: 13,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#10231D",
    fontSize: 18,
    fontWeight: "800",
  },
  seeAll: {
    color: "#0B8F6A",
    fontWeight: "700",
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#60716B",
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E6ECE9",
  },
  transactionIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCEAEA",
  },
  incomingIcon: {
    backgroundColor: "#E8F7F1",
  },
  transactionIconText: {
    color: "#0B8F6A",
    fontSize: 18,
    fontWeight: "800",
  },
  transactionInfo: {
    flex: 1,
    marginHorizontal: 11,
  },
  transactionTitle: {
    color: "#243B33",
    fontWeight: "700",
  },
  transactionStatus: {
    marginTop: 3,
    color: "#7A8984",
    fontSize: 12,
    textTransform: "capitalize",
  },
  amount: {
    fontSize: 13,
    fontWeight: "800",
  },
  incoming: {
    color: "#0B8F6A",
  },
  outgoing: {
    color: "#C23B3B",
  },
});