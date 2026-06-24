import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebaseConfig";
import {
  DigitalProduct,
  getDigitalProducts,
} from "../services/productApi";
import { formatRupiah } from "../utils/format";
import { verifyPin } from "../utils/security";

export default function PayScreen() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<DigitalProduct | null>(null);

  const [customerNumber, setCustomerNumber] = useState("");
  const [pin, setPin] = useState("");

  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const data = await getDigitalProducts();

      setProducts(data);
    } catch (error: any) {
      console.log("FETCH PRODUCT ERROR:", error.message);

      Alert.alert(
        "Gagal mengambil produk",
        "Pastikan JSON Server sudah berjalan dan URL API sudah benar."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "User belum login");
        return;
      }

      if (!selectedProduct) {
        Alert.alert("Peringatan", "Pilih produk terlebih dahulu");
        return;
      }

      if (customerNumber.trim() === "") {
        Alert.alert(
          "Peringatan",
          "Nomor tujuan / ID pelanggan harus diisi"
        );
        return;
      }

      if (pin.trim() === "") {
        Alert.alert("Peringatan", "PIN transaksi harus diisi");
        return;
      }

      setPaying(true);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Error", "Data pengguna tidak ditemukan");
        return;
      }

      const userData = userSnap.data();

      if (!userData.pinHash) {
        Alert.alert(
          "PIN belum dibuat",
          "Silakan buat PIN transaksi terlebih dahulu di menu Saya."
        );
        return;
      }

      const isPinValid = await verifyPin(pin, userData.pinHash);

      if (!isPinValid) {
        Alert.alert(
          "PIN salah",
          "PIN transaksi yang kamu masukkan tidak sesuai."
        );
        return;
      }

      if (userData.balance < selectedProduct.price) {
        Alert.alert(
          "Saldo tidak cukup",
          "Silakan lakukan top up saldo terlebih dahulu."
        );
        return;
      }

      await runTransaction(db, async (transaction) => {
        const freshUserSnap = await transaction.get(userRef);

        if (!freshUserSnap.exists()) {
          throw new Error("Data pengguna tidak ditemukan");
        }

        const freshUserData = freshUserSnap.data();
        const currentBalance = freshUserData.balance || 0;

        if (currentBalance < selectedProduct.price) {
          throw new Error("Saldo tidak cukup");
        }

        const newBalance = currentBalance - selectedProduct.price;

        transaction.update(userRef, {
          balance: newBalance,
        });

        const transactionRef = doc(collection(db, "transactions"));

        transaction.set(transactionRef, {
          uid: user.uid,
          type: "payment",
          title: selectedProduct.name,
          category: selectedProduct.category,
          provider: selectedProduct.provider,
          productType: selectedProduct.type,
          targetNumber: customerNumber.trim(),
          amount: selectedProduct.price,
          status: "success",
          createdAt: serverTimestamp(),
        });
      });

      Alert.alert(
        "Pembayaran berhasil",
        `${selectedProduct.name} berhasil dibayar sebesar ${formatRupiah(
          selectedProduct.price
        )}`
      );

      setSelectedProduct(null);
      setCustomerNumber("");
      setPin("");
    } catch (error: any) {
      console.log("PAYMENT ERROR:", error.message);

      Alert.alert(
        "Pembayaran gagal",
        error.message || "Terjadi kesalahan saat pembayaran"
      );
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Bayar Produk Digital</Text>

      <Text style={styles.subtitle}>
        Pilih produk digital dari API JSON Server
      </Text>

      <Button
        title="Load Ulang Produk"
        onPress={fetchProducts}
      />

      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : products.length === 0 ? (
        <Text style={styles.emptyText}>
          Data produk tidak tersedia
        </Text>
      ) : (
        products.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              selectedProduct?.id === item.id &&
                styles.selectedCard,
            ]}
            onPress={() => setSelectedProduct(item)}
          >
            <Text style={styles.productName}>
              {item.name}
            </Text>

            <Text style={styles.productInfo}>
              Provider: {item.provider}
            </Text>

            <Text style={styles.productInfo}>
              Kategori: {item.category}
            </Text>

            <Text style={styles.productDesc}>
              {item.description}
            </Text>

            <Text style={styles.price}>
              {formatRupiah(item.price)}
            </Text>
          </TouchableOpacity>
        ))
      )}

      <View style={styles.divider} />

      <Text style={styles.subtitle}>
        Detail Pembayaran
      </Text>

      <Text style={styles.label}>
        Produk Dipilih
      </Text>

      <Text style={styles.selectedText}>
        {selectedProduct
          ? selectedProduct.name
          : "Belum ada produk dipilih"}
      </Text>

      <TextInput
        placeholder="Masukkan nomor HP / ID pelanggan"
        value={customerNumber}
        onChangeText={setCustomerNumber}
        style={styles.input}
        keyboardType="number-pad"
      />

      <TextInput
        placeholder="Masukkan PIN transaksi"
        value={pin}
        onChangeText={setPin}
        style={styles.input}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={6}
      />

      <Button
        title={paying ? "Memproses..." : "Bayar Sekarang"}
        onPress={handlePayment}
        disabled={paying}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 18,
  },

  emptyText: {
    fontSize: 14,
    color: "#6b7280",
  },

  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },

  selectedCard: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },

  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },

  productInfo: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 2,
  },

  productDesc: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
    marginBottom: 8,
  },

  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#374151",
  },

  selectedText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
});