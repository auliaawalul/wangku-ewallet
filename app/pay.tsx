import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { getDigitalProducts } from "../services/productApi";
import { Product } from "../types";

const rupiahRate = 16000;

export default function PayScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDigitalProducts();
      setProducts(data.slice(0, 8));
    } catch (err) {
      setError("Data produk gagal dimuat. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  const payProduct = async (product: Product) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Gagal", "Silakan login terlebih dahulu");
        return;
      }

      const priceInRupiah = Math.round(product.price * rupiahRate);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Gagal", "Data pengguna tidak ditemukan");
        return;
      }

      const currentBalance = userSnap.data().balance || 0;

      if (currentBalance < priceInRupiah) {
        Alert.alert("Saldo tidak cukup", "Silakan top up saldo terlebih dahulu");
        return;
      }

      await updateDoc(userRef, {
        balance: currentBalance - priceInRupiah,
      });

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "payment",
        title: `Pembayaran ${product.title}`,
        amount: priceInRupiah,
        status: "success",
        createdAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Pembayaran produk digital berhasil");
    } catch (err) {
      Alert.alert("Error", "Pembayaran gagal diproses");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay Produk Digital</Text>
      <Text style={styles.subtitle}>Ambil data produk dari API menggunakan Axios</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={fetchProducts}>
        <Text style={styles.primaryButtonText}>Load Produk API</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0B8F6A" style={styles.loading} />}
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      {!loading && products.length === 0 && <Text style={styles.empty}>Data tidak tersedia</Text>}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const priceInRupiah = Math.round(item.price * rupiahRate);

          return (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.cardBody}>
                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.price}>{formatRupiah(priceInRupiah)}</Text>
                <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                <TouchableOpacity style={styles.payButton} onPress={() => payProduct(item)}>
                  <Text style={styles.payButtonText}>Bayar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>Kembali</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FAF8",
    padding: 20,
    paddingTop: 52,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#10231D",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#5B6B65",
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: "#0B8F6A",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  loading: {
    marginTop: 18,
  },
  error: {
    color: "#C23B3B",
    marginTop: 14,
  },
  empty: {
    marginTop: 16,
    color: "#60716B",
  },
  list: {
    paddingVertical: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2EAE6",
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: "#EEF4F1",
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10231D",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: "#0B8F6A",
  },
  desc: {
    marginTop: 4,
    fontSize: 12,
    color: "#5B6B65",
  },
  payButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#E8F7F1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payButtonText: {
    color: "#0B8F6A",
    fontWeight: "700",
  },
  back: {
    textAlign: "center",
    paddingVertical: 12,
    color: "#0B8F6A",
    fontWeight: "700",
  },
});