import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../firebase/firebaseConfig";
import { WalletTransaction } from "../../types";

type TransactionItem = WalletTransaction & {
  id: string;
};

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (createdAt: any) => {
    if (!createdAt?.toDate) return "Sedang diproses";

    return createdAt.toDate().toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadTransactions = useCallback(async () => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    try {
      setLoading(true);
      const transactionQuery = query(
        collection(db, "transactions"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(transactionQuery);
      const result: TransactionItem[] = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as WalletTransaction),
      }));

      result.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      setTransactions(result);
    } catch (error) {
      Alert.alert("Error", "Riwayat transaksi gagal dimuat");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Riwayat Transaksi</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0B8F6A" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Data tidak tersedia</Text>
              <Text style={styles.emptyText}>Transaksi baru akan tampil di halaman ini.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const isTopUp = item.type === "topup";

            return (
              <View style={styles.card}>
                <View style={[styles.iconBox, isTopUp && styles.incomingBox]}>
                  <Text style={styles.iconText}>{isTopUp ? "+" : "-"}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.transactionTitle}>{item.title}</Text>
                  <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
                  <Text style={styles.status}>{item.status}</Text>
                </View>
                <Text style={[styles.amount, isTopUp ? styles.incoming : styles.outgoing]}>
                  {isTopUp ? "+" : "-"}{formatRupiah(item.amount)}
                </Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FAF8",
    paddingTop: 52,
  },
  header: {
    paddingHorizontal: 20,
  },
  back: {
    color: "#0B8F6A",
    fontWeight: "700",
  },
  title: {
    marginTop: 12,
    color: "#10231D",
    fontSize: 26,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 20,
    flexGrow: 1,
  },
  emptyBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyTitle: {
    color: "#243B33",
    fontSize: 17,
    fontWeight: "800",
  },
  emptyText: {
    marginTop: 6,
    color: "#60716B",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2EAE6",
    borderRadius: 8,
    padding: 13,
    marginBottom: 11,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FCEAEA",
  },
  incomingBox: {
    backgroundColor: "#E8F7F1",
  },
  iconText: {
    color: "#0B8F6A",
    fontSize: 19,
    fontWeight: "800",
  },
  info: {
    flex: 1,
    marginHorizontal: 11,
  },
  transactionTitle: {
    color: "#243B33",
    fontWeight: "700",
  },
  date: {
    marginTop: 3,
    color: "#7A8984",
    fontSize: 11,
  },
  status: {
    marginTop: 3,
    color: "#0B8F6A",
    fontSize: 11,
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