import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { WalletTransaction } from "../types";
import { formatRupiah } from "../utils/format";

type RangeOption = 1 | 3 | 7 | 30;

type TrendItem = {
  dateKey: string;
  income: number;
  expense: number;
};

export default function TrendsScreen() {
  const [range, setRange] = useState<RangeOption>(7);
  const [trend, setTrend] = useState<TrendItem[]>([]);

  const buildDateKey = (date: Date) => date.toISOString().slice(0, 10);

  const loadTrend = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDocs(
      query(collection(db, "transactions"), where("uid", "==", user.uid))
    );

    const now = new Date();
    const start = new Date();
    start.setDate(now.getDate() - range + 1);
    start.setHours(0, 0, 0, 0);

    const map: Record<string, TrendItem> = {};

    for (let i = 0; i < range; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const key = buildDateKey(date);
      map[key] = { dateKey: key, income: 0, expense: 0 };
    }

    snap.forEach((docSnap) => {
      const data = docSnap.data() as WalletTransaction;
      const date = data.createdAt?.toDate?.() || new Date();

      if (date < start || date > now) return;

      const key = buildDateKey(date);
      if (!map[key]) return;

      if (data.type === "topup") map[key].income += data.amount;
      if (data.type === "payment") map[key].expense += data.amount;
    });

    setTrend(Object.values(map));
  };

  const maxValue = Math.max(
    1,
    ...trend.map((item) => Math.max(item.income, item.expense))
  );

  useEffect(() => {
    loadTrend();
  }, [range]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trend Keuangan</Text>
      <Text style={styles.subtitle}>Pemasukan dan pengeluaran pengguna</Text>

      <View style={styles.filterRow}>
        {[1, 3, 7, 30].map((item) => (
          <TouchableOpacity
            key={item}
            style={range === item ? styles.activeFilter : styles.filter}
            onPress={() => setRange(item as RangeOption)}
          >
            <Text style={range === item ? styles.activeFilterText : styles.filterText}>
              {item} Hari
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {trend.map((item) => (
        <View key={item.dateKey} style={styles.card}>
          <Text style={styles.date}>{item.dateKey}</Text>
          <Text style={styles.label}>Pemasukan: {formatRupiah(item.income)}</Text>
          <View style={styles.barBackground}>
            <View style={[styles.incomeBar, { width: `${(item.income / maxValue) * 100}%` }]} />
          </View>
          <Text style={styles.label}>Pengeluaran: {formatRupiah(item.expense)}</Text>
          <View style={styles.barBackground}>
            <View style={[styles.expenseBar, { width: `${(item.expense / maxValue) * 100}%` }]} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF8", padding: 20, paddingTop: 55 },
  title: { fontSize: 26, fontWeight: "900", color: "#10231D" },
  subtitle: { color: "#5B6B65", marginTop: 6, marginBottom: 16 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  filter: { backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#D7E3DD" },
  activeFilter: { backgroundColor: "#0B8F6A", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  filterText: { color: "#0B8F6A", fontWeight: "800" },
  activeFilterText: { color: "#FFFFFF", fontWeight: "800" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#D7E3DD" },
  date: { color: "#10231D", fontWeight: "900", marginBottom: 8 },
  label: { color: "#5B6B65", marginTop: 8 },
  barBackground: { height: 10, backgroundColor: "#E7EFEB", borderRadius: 10, overflow: "hidden", marginTop: 6 },
  incomeBar: { height: 10, backgroundColor: "#0B8F6A" },
  expenseBar: { height: 10, backgroundColor: "#C23B3B" },
});