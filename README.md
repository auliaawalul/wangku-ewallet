# Rancang Bangun Aplikasi Mobile E-Wallet Berbasis Expo, Axios, dan Firebase

## 1. Identitas Aplikasi

Nama aplikasi: WangKu

Jenis aplikasi: E-Wallet atau dompet digital sederhana

Platform: React Native berbasis Expo

Backend-as-a-Service: Firebase Authentication dan Cloud Firestore

HTTP Client: Axios

Skenario tim: Skenario B - Tim berisi 2 orang

## 2. Latar Belakang

WangKu dirancang sebagai aplikasi dompet digital sederhana yang dapat digunakan untuk
melihat saldo, melakukan top up, membeli produk digital, dan melihat riwayat transaksi.
Aplikasi ini memenuhi ketentuan ujian praktikum Mobile Computing karena menggabungkan:

1. Axios untuk mengambil data dari layanan API eksternal.
2. Firebase untuk autentikasi pengguna dan penyimpanan data transaksi.
3. UI/UX mobile yang interaktif dan responsif.
4. Minimal 3 fitur utama yang berfungsi dengan baik.

Alur data Axios mengikuti konsep dari materi Modul 5, yaitu:

API -> Axios -> State -> UI

## 3. Tujuan Aplikasi

1. Membuat aplikasi e-wallet yang memiliki fungsi nyata dan mudah didemokan.
2. Mengambil data produk digital atau voucher dari API menggunakan Axios.
3. Menyimpan data pengguna, saldo, dan transaksi ke Firebase.
4. Menampilkan data secara responsif dalam bentuk card, list, dan tombol aksi.
5. Membagi pekerjaan tim 2 orang sesuai Skenario B pada ketentuan ujian.

## 4. Teknologi dan Library

| Kebutuhan | Teknologi |
|---|---|
| Framework mobile | React Native Expo |
| Routing | Expo Router |
| HTTP request | Axios |
| Backend-as-a-Service | Firebase |
| Login dan register | Firebase Authentication |
| Database | Cloud Firestore |
| State lokal | useState dan useEffect |
| UI utama | View, Text, TextInput, TouchableOpacity, ScrollView, FlatList |

Perintah instalasi library:

```bash
npx create-expo-app WangKu-ewallet
cd WangKu-ewallet
npm install axios firebase
npx expo start
```

## 5. API yang Digunakan

API utama yang digunakan:

```txt
https://fakestoreapi.com/products
```

Alasan pemilihan API:

1. API ini sesuai dengan materi Modul 5 Fetch Data Axios.
2. Data memiliki title, price, description, category, dan image.
3. Dalam aplikasi WangKu, data produk dari API dipakai sebagai daftar produk digital,
   voucher, merchant, atau layanan pembayaran.

Contoh alur data:

1. User membuka halaman Pay.
2. Aplikasi menjalankan fungsi `fetchProducts()`.
3. Axios mengirim GET request ke API.
4. Response API disimpan ke state `products`.
5. UI menampilkan produk dalam bentuk list card.
6. User memilih produk dan membayar menggunakan saldo WangKu.
7. Data transaksi disimpan ke Cloud Firestore.

## 6. Firebase yang Digunakan

Layanan Firebase:

1. Firebase Authentication
   - Register akun.
   - Login akun.
   - Logout akun.

2. Cloud Firestore
   - Menyimpan profil e-wallet.
   - Menyimpan saldo pengguna.
   - Menyimpan riwayat transaksi.
   - Menyimpan data top up dan pembayaran.

## 7. Fitur Aplikasi

### Fitur Utama 1 - Autentikasi Pengguna

Fungsi:

1. Pengguna dapat membuat akun menggunakan email dan password.
2. Pengguna dapat login ke aplikasi.
3. Setelah login, pengguna masuk ke halaman dashboard e-wallet.
4. Data awal pengguna dibuat di Firestore, seperti nama, email, dan saldo awal.

Firebase yang digunakan:

1. Firebase Authentication
2. Cloud Firestore collection `users`

Data yang disimpan:

```ts
{
  uid: string,
  name: string,
  email: string,
  balance: number,
  createdAt: Date
}
```

### Fitur Utama 2 - Dashboard Saldo dan Ringkasan Transaksi

Fungsi:

1. Menampilkan nama pengguna.
2. Menampilkan saldo e-wallet.
3. Menampilkan 3 transaksi terbaru.
4. Menampilkan tombol cepat: Top Up, Pay, dan History.

Firebase yang digunakan:

1. Firestore collection `users`
2. Firestore collection `transactions`

State yang digunakan:

1. `userProfile`
2. `balance`
3. `recentTransactions`
4. `loading`

### Fitur Utama 3 - Pembayaran Produk Digital Menggunakan Axios

Fungsi:

1. Mengambil daftar produk digital dari API menggunakan Axios.
2. Menampilkan produk dalam bentuk list.
3. User dapat memilih salah satu produk.
4. Harga produk dikonversi ke rupiah.
5. Jika saldo cukup, transaksi pembayaran berhasil.
6. Saldo pengguna berkurang.
7. Riwayat pembayaran disimpan ke Firestore.

Axios yang digunakan:

```ts
const response = await axios.get("https://fakestoreapi.com/products");
```

Firestore yang digunakan:

1. Update saldo pada collection `users`.
2. Tambah dokumen transaksi pada collection `transactions`.

### Fitur Tambahan - Top Up Saldo

Fungsi:

1. User memasukkan nominal top up.
2. Sistem memvalidasi nominal.
3. Saldo pengguna bertambah.
4. Data top up tersimpan pada riwayat transaksi.

Manfaat fitur:

Fitur ini membuat aplikasi e-wallet lebih lengkap karena pengguna dapat menambah saldo
sebelum melakukan pembayaran produk digital.

## 8. Pembagian Tugas Tim Skenario B

| Anggota | Peran | Tugas | Tanggung Jawab Demo |
|---|---|---|---|
| Anggota 1 | Frontend & Axios Specialist | Merancang UI/UX, halaman Dashboard, halaman Pay, integrasi Axios ke API produk | Menjelaskan desain UI, state produk, loading, error handling, dan alur API -> Axios -> State -> UI pada 2 fitur |
| Anggota 2 | Backend, State & Firebase Specialist | Setup Firebase, Authentication, Firestore, state saldo, top up, pembayaran, dan riwayat transaksi | Menjelaskan struktur Firebase, manajemen state lokal, proses simpan data transaksi, update saldo, dan rules database |

Rekomendasi pembagian commit:

| Commit | Anggota | Isi Commit |
|---|---|---|
| commit 1 | Anggota 1 | Membuat layout dashboard dan navigasi |
| commit 2 | Anggota 1 | Membuat halaman Pay dan fetch produk dengan Axios |
| commit 3 | Anggota 2 | Setup Firebase config dan Authentication |
| commit 4 | Anggota 2 | Membuat Firestore users dan transactions |
| commit 5 | Anggota 1 dan 2 | Integrasi pembayaran, top up, dan finalisasi UI |

## 9. Struktur Folder Project

```txt
WangKu-ewallet/
|-- app/
|   |-- _layout.tsx
|   |-- index.tsx
|   |-- login.tsx
|   |-- register.tsx
|   |-- pay.tsx
|   |-- topup.tsx
|   `-- history.tsx
|-- firebase/
|   `-- firebaseConfig.ts
|-- services/
|   `-- productApi.ts
|-- types/
|   `-- index.ts
`-- package.json
```

## 10. Rancangan Database Firestore

### Collection `users`

Path:

```txt
users/{uid}
```

Field:

| Field | Tipe Data | Fungsi |
|---|---|---|
| uid | string | ID pengguna dari Firebase Auth |
| name | string | Nama pengguna |
| email | string | Email pengguna |
| balance | number | Saldo e-wallet |
| createdAt | timestamp | Waktu akun dibuat |

### Collection `transactions`

Path:

```txt
transactions/{transactionId}
```

Field:

| Field | Tipe Data | Fungsi |
|---|---|---|
| uid | string | ID pemilik transaksi |
| type | string | topup, payment, transfer |
| title | string | Judul transaksi |
| amount | number | Nominal transaksi |
| status | string | success atau failed |
| createdAt | timestamp | Waktu transaksi |

## 11. Rancangan UI/UX

### Halaman Login

Komponen:

1. Logo aplikasi WangKu.
2. Input email.
3. Input password.
4. Tombol Login.
5. Link menuju Register.

### Halaman Register

Komponen:

1. Input nama.
2. Input email.
3. Input password.
4. Tombol Register.
5. Setelah register berhasil, profil user dibuat di Firestore.

### Halaman Dashboard

Komponen:

1. Header "Halo, Nama User".
2. Card saldo.
3. Tombol aksi cepat: Top Up, Pay, dan History.
4. Ringkasan transaksi terbaru.

### Halaman Pay

Komponen:

1. Tombol load produk digital.
2. Loading indicator saat data API sedang diproses.
3. Error message jika request gagal.
4. List produk dari API.
5. Tombol Bayar pada setiap item.

### Halaman Top Up

Komponen:

1. Input nominal top up.
2. Tombol Top Up.
3. Validasi nominal.
4. Pesan berhasil.

### Halaman History

Komponen:

1. List seluruh riwayat transaksi.
2. Label transaksi masuk dan keluar.
3. Warna hijau untuk top up.
4. Warna merah untuk pembayaran.

## 12. Kode Inti

### firebase/firebaseConfig.ts

```ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "ISI_AUTH_DOMAIN",
  projectId: "ISI_PROJECT_ID",
  storageBucket: "ISI_STORAGE_BUCKET",
  messagingSenderId: "ISI_MESSAGING_SENDER_ID",
  appId: "ISI_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

### services/productApi.ts

```ts
import axios from "axios";

export const productApi = axios.create({
  baseURL: "https://fakestoreapi.com",
  timeout: 10000,
});

export const getDigitalProducts = async () => {
  const response = await productApi.get("/products");
  return response.data;
};
```

### types/index.ts

```ts
export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

export type WalletTransaction = {
  id?: string;
  uid: string;
  type: "topup" | "payment" | "transfer";
  title: string;
  amount: number;
  status: "success" | "failed";
  createdAt: any;
};
```

### app/_layout.tsx

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="index" />
      <Stack.Screen name="pay" />
      <Stack.Screen name="topup" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
```

### app/login.tsx

```tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Peringatan", "Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Login gagal",
        error.code === "auth/invalid-credential"
          ? "Email atau password tidak benar"
          : "Tidak dapat masuk ke aplikasi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logo}>P</Text>
      </View>
      <Text style={styles.title}>Masuk ke WangKu</Text>
      <Text style={styles.subtitle}>Kelola saldo dan transaksi dalam satu aplikasi</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerRow}>
        <Text style={styles.registerText}>Belum memiliki akun? </Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerLink}>Daftar sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F6FAF8",
    padding: 24,
  },
  logoBox: {
    width: 58,
    height: 58,
    borderRadius: 8,
    backgroundColor: "#0B8F6A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10231D",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 28,
    color: "#60716B",
    fontSize: 14,
  },
  label: {
    marginBottom: 7,
    color: "#243B33",
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    marginTop: 6,
    backgroundColor: "#0B8F6A",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  registerText: {
    color: "#60716B",
  },
  registerLink: {
    color: "#0B8F6A",
    fontWeight: "700",
  },
});
```

### app/register.tsx

```tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Peringatan", "Semua data wajib diisi");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Peringatan", "Password minimal 6 karakter");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Peringatan", "Konfirmasi password tidak sama");
      return;
    }

    try {
      setLoading(true);
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: name.trim(),
        email: email.trim(),
        balance: 0,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Akun WangKu berhasil dibuat");
      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Registrasi gagal",
        error.code === "auth/email-already-in-use"
          ? "Email sudah digunakan"
          : "Akun tidak dapat dibuat"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat akun WangKu</Text>
      <Text style={styles.subtitle}>Isi data berikut untuk membuat dompet digital</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password minimal 6 karakter"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Konfirmasi password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Daftar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F6FAF8",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#10231D",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 26,
    color: "#60716B",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 4,
    backgroundColor: "#0B8F6A",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  back: {
    marginTop: 20,
    textAlign: "center",
    color: "#0B8F6A",
    fontWeight: "700",
  },
});
```

### app/index.tsx

```tsx
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
import { auth, db } from "../firebase/firebaseConfig";

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
```

### app/history.tsx

```tsx
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { WalletTransaction } from "../types";

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
```

### app/pay.tsx

```tsx
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
```

### app/topup.tsx

```tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function TopUpScreen() {
  const [amount, setAmount] = useState("");

  const topUpBalance = async () => {
    try {
      const user = auth.currentUser;
      const nominal = Number(amount);

      if (!user) {
        Alert.alert("Gagal", "Silakan login terlebih dahulu");
        return;
      }

      if (!nominal || nominal < 10000) {
        Alert.alert("Peringatan", "Minimal top up Rp10.000");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const currentBalance = userSnap.exists() ? userSnap.data().balance || 0 : 0;

      await updateDoc(userRef, {
        balance: currentBalance + nominal,
      });

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type: "topup",
        title: "Top Up Saldo",
        amount: nominal,
        status: "success",
        createdAt: serverTimestamp(),
      });

      setAmount("");
      Alert.alert("Berhasil", "Saldo berhasil ditambahkan");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Top up gagal diproses");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Up Saldo</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nominal"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={topUpBalance}>
        <Text style={styles.buttonText}>Top Up Sekarang</Text>
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
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#0B8F6A",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
```

## 13. Alur Demo 3 Fitur Utama

### Demo Fitur 1 - Login/Register

1. Buka halaman Register.
2. Isi nama, email, dan password.
3. Data akun tersimpan di Firebase Authentication.
4. Profil user dan saldo awal tersimpan di Firestore collection `users`.
5. Login menggunakan akun yang sudah dibuat.

### Demo Fitur 2 - Dashboard

1. Setelah login, aplikasi menampilkan dashboard.
2. Dashboard membaca data saldo dari Firestore.
3. Aplikasi menampilkan tombol Top Up, Pay, dan History.
4. Riwayat transaksi terbaru ditampilkan dari Firestore.

### Demo Fitur 3 - Pay Produk Digital

1. Buka halaman Pay.
2. Tekan tombol Load Produk API.
3. Axios mengambil data dari API.
4. Data API disimpan ke state `products`.
5. UI menampilkan daftar produk.
6. Tekan tombol Bayar.
7. Saldo berkurang dan transaksi disimpan ke Firestore.

## 14. Error Handling

Error handling yang perlu ada:

1. Jika API gagal dimuat, tampilkan pesan "Data produk gagal dimuat".
2. Jika data kosong, tampilkan "Data tidak tersedia".
3. Jika saldo kurang, tampilkan "Saldo tidak cukup".
4. Jika user belum login, tampilkan "Silakan login terlebih dahulu".
5. Jika nominal top up kurang dari Rp10.000, tampilkan peringatan.

## 15. Penjelasan Singkat untuk README

WangKu adalah aplikasi mobile e-wallet berbasis React Native Expo yang mengintegrasikan
Axios dan Firebase. Axios digunakan untuk mengambil data produk digital dari API publik,
sedangkan Firebase digunakan untuk autentikasi pengguna dan penyimpanan data saldo serta
riwayat transaksi. Aplikasi memiliki 3 fitur utama, yaitu autentikasi pengguna, dashboard saldo,
dan pembayaran produk digital. Fitur tambahan yang tersedia adalah top up saldo.

## 16. Kesimpulan

Rancangan aplikasi WangKu sudah memenuhi ketentuan ujian praktikum Mobile Computing
semester genap 2025-2026 karena:

1. Menggunakan Axios untuk HTTP request ke API publik.
2. Menggunakan Firebase Authentication dan Cloud Firestore.
3. Memiliki 3 fitur utama yang jelas dan berfungsi.
4. Memiliki 1 fitur tambahan yang mendukung fungsi e-wallet.
5. Pembagian tugas mengikuti Skenario B untuk tim berisi 2 orang.
6. UI/UX dibuat responsif dengan card saldo, list produk, tombol aksi, loading state, empty state, dan error state.
