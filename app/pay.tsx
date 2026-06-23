import { router } from "expo-router";
import { collection, doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebase/firebaseConfig";
import { getDigitalProducts } from "../services/productApi";
import { DigitalProduct, UserProfile } from "../types";
import { formatRupiah } from "../utils/format";
import { hashPin } from "../utils/security";

export default function PayScreen() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [pin, setPin] = useState("");
  const [paying, setPaying] = useState(false);

 const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      // TAMBAHKAN 'as any' di ujung fungsi getDigitalProducts() seperti di bawah ini:
      const data = await getDigitalProducts() as any; 
      setProducts(data.slice(0, 10));
    } catch (err) {
      setError("Data produk digital gagal dimuat. Periksa koneksi internet atau URL API.");
    } finally {
      setLoading(false);
    }
  };

  const openPinModal = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setPin("");
  };

  const processPayment = async () => {
    try {
      const user = auth.currentUser;
      const product = selectedProduct;

      if (!user || !product) {
        Alert.alert("Gagal", "Data pengguna atau produk tidak ditemukan");
        return;
      }

      if (pin.length !== 6) {
        Alert.alert("Peringatan", "Masukkan PIN transaksi 6 digit");
        return;
      }

      setPaying(true);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Gagal", "Profil pengguna tidak ditemukan");
        return;
      }

      const userProfile = userSnap.data() as UserProfile;

      if (!userProfile.transactionPinHash) {
        Alert.alert(
          "PIN belum dibuat",
          "Silakan buat PIN transaksi di menu Saya > Profil dan Keamanan Akun"
        );
        router.push("/profile-security");
        return;
      }

      const inputPinHash = await hashPin(pin);

      if (inputPinHash !== userProfile.transactionPinHash) {
        Alert.alert("PIN salah", "Pembayaran dibatalkan karena PIN tidak sesuai");
        return;
      }

      await runTransaction(db, async (transaction) => {
        const freshUserSnap = await transaction.get(userRef);
        const balance = freshUserSnap.data()?.balance || 0;

        if (balance < product.price) {
          throw new Error("Saldo tidak cukup");
        }

        transaction.update(userRef, {
          balance: balance - product.price,
        });

        const trxRef = doc(collection(db, "transactions"));
        transaction.set(trxRef, {
          uid: user.uid,
          type: "payment",
          title: `Pembayaran ${product.name}`,
          category: product.category,
          provider: product.provider,
          amount: product.price,
          status: "success",
          createdAt: serverTimestamp(),
        });
      });

      Alert.alert("Berhasil", "Pembayaran produk digital berhasil");
      setSelectedProduct(null);
      setPin("");
    } catch (error: any) {
      Alert.alert("Pembayaran gagal", error.message || "Transaksi tidak dapat diproses");
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produk Digital</Text>
      <Text style={styles.subtitle}>Pulsa, paket data, tagihan, dan top up e-money</Text>

      <TouchableOpacity style={styles.primaryButton} onPress={fetchProducts}>
        <Text style={styles.primaryButtonText}>Load Produk Digital API</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0B8F6A" style={styles.loading} />}
      {error !== "" && <Text style={styles.error}>{error}</Text>}
      {!loading && products.length === 0 && <Text style={styles.empty}>Data tidak tersedia</Text>}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.iconUrl }} style={styles.image} />
            <View style={styles.cardBody}>
              <Text style={styles.productTitle}>{item.name}</Text>
              <Text style={styles.category}>{item.category} - {item.provider}</Text>
              <Text style={styles.price}>{formatRupiah(item.price)}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <TouchableOpacity style={styles.payButton} onPress={() => openPinModal(item)}>
                <Text style={styles.payButtonText}>Bayar Pakai PIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>Kembali</Text>
      </TouchableOpacity>

      <Modal visible={!!selectedProduct} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Konfirmasi Pembayaran</Text>
            <Text style={styles.modalProduct}>{selectedProduct?.name}</Text>
            <Text style={styles.modalPrice}>{formatRupiah(selectedProduct?.price || 0)}</Text>
            <TextInput
              style={styles.pinInput}
              placeholder="Masukkan PIN 6 digit"
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              value={pin}
              onChangeText={setPin}
            />
            <TouchableOpacity style={styles.primaryButton} onPress={processPayment} disabled={paying}>
              <Text style={styles.primaryButtonText}>{paying ? "Memproses..." : "Bayar Sekarang"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedProduct(null)}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF8", padding: 20, paddingTop: 52 },
  title: { fontSize: 26, fontWeight: "900", color: "#10231D" },
  subtitle: { marginTop: 6, fontSize: 14, color: "#5B6B65" },
  primaryButton: { marginTop: 18, backgroundColor: "#0B8F6A", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  loading: { marginTop: 18 },
  error: { color: "#C23B3B", marginTop: 14 },
  empty: { marginTop: 16, color: "#60716B" },
  list: { paddingVertical: 16 },
  card: { flexDirection: "row", backgroundColor: "#FFFFFF", borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#E2EAE6" },
  image: { width: 62, height: 62, borderRadius: 14, backgroundColor: "#EEF4F1" },
  cardBody: { flex: 1, marginLeft: 12 },
  productTitle: { fontSize: 15, fontWeight: "900", color: "#10231D" },
  category: { marginTop: 3, fontSize: 12, color: "#5B6B65" },
  price: { marginTop: 5, fontSize: 16, fontWeight: "900", color: "#0B8F6A" },
  desc: { marginTop: 4, fontSize: 12, color: "#5B6B65" },
  payButton: { marginTop: 10, alignSelf: "flex-start", backgroundColor: "#E8F7F1", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  payButtonText: { color: "#0B8F6A", fontWeight: "800" },
  back: { textAlign: "center", paddingVertical: 12, color: "#0B8F6A", fontWeight: "800" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#FFFFFF", padding: 22, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalTitle: { fontSize: 20, fontWeight: "900", color: "#10231D" },
  modalProduct: { marginTop: 10, color: "#10231D", fontWeight: "700" },
  modalPrice: { marginTop: 6, color: "#0B8F6A", fontSize: 22, fontWeight: "900" },
  pinInput: { backgroundColor: "#F6FAF8", borderWidth: 1, borderColor: "#D7E3DD", borderRadius: 12, padding: 14, marginTop: 16, textAlign: "center", fontSize: 18, letterSpacing: 4 },
  cancelText: { textAlign: "center", color: "#C23B3B", fontWeight: "800", marginTop: 14 },
});
