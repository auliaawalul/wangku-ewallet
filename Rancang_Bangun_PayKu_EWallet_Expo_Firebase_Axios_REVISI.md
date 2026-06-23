# Rancang Bangun Aplikasi Mobile E-Wallet PayKu Berbasis Expo, Axios, dan Firebase - Versi Revisi Fitur

## 1. Identitas Aplikasi

Nama aplikasi: **PayKu**

Jenis aplikasi: **E-Wallet atau dompet digital sederhana**

Platform: **React Native berbasis Expo**

Routing: **Expo Router**

Backend-as-a-Service: **Firebase Authentication, Cloud Firestore, dan Firebase Storage**

HTTP Client: **Axios**

Skenario tim: **Skenario B - Tim berisi 2 orang**

## 2. Dasar Ketentuan Ujian

Aplikasi PayKu dirancang untuk memenuhi ketentuan ujian praktikum Mobile Computing, yaitu aplikasi mobile harus mengintegrasikan layanan API menggunakan Axios dan Backend-as-a-Service menggunakan Firebase. Ketentuan juga menyebutkan bahwa aplikasi minimal memiliki 3 fitur utama yang berfungsi dengan baik, serta untuk Skenario B tim berisi 2 orang dibagi menjadi Frontend & Axios Specialist dan Backend, State & Firebase Specialist.

Alur Axios mengikuti materi Modul 5, yaitu:

```txt
API -> Axios -> State -> UI
```

Pada PayKu, Axios digunakan untuk mengambil data layanan produk digital dari API. Data hasil response API disimpan ke state, kemudian ditampilkan ke UI dalam bentuk list produk digital.

## 3. Revisi Fitur Utama Aplikasi

### Fitur Utama 1 - Login/Register Pengguna

Fungsi terbaru:

1. Pengguna dapat membuat akun menggunakan nama, email, nomor ponsel, tanggal lahir, dan password.
2. Tanggal lahir divalidasi. Pengguna hanya dapat register jika tanggal lahir **sebelum 1 Januari 2010**.
3. Nomor ponsel disimpan di Firestore dan dibuatkan mapping untuk login menggunakan nomor ponsel.
4. Pengguna dapat login menggunakan **email atau nomor ponsel**.
5. Setelah login, pengguna masuk ke dashboard e-wallet.
6. Data awal pengguna dibuat di Firestore, seperti nama, email, nomor ponsel, tanggal lahir, saldo awal, foto profil, PIN transaksi, dan pengaturan sistem.

Firebase yang digunakan:

1. Firebase Authentication
2. Cloud Firestore collection `users`
3. Cloud Firestore collection `phoneLoginMap`

Data `users/{uid}`:

```ts
{
  uid: string,
  name: string,
  email: string,
  phoneNumber: string,
  birthDate: string,
  balance: number,
  photoURL: string,
  transactionPinHash: string,
  settings: {
    notifications: boolean,
    language: "id" | "en",
    theme: "light" | "dark"
  },
  createdAt: Date
}
```

Data `phoneLoginMap/{phoneNumber}`:

```ts
{
  uid: string,
  email: string,
  createdAt: Date
}
```

Catatan penting:

Firebase Authentication bawaan email/password tetap menggunakan email sebagai identitas utama. Agar aplikasi bisa login menggunakan nomor ponsel tanpa SMS OTP, aplikasi membuat collection `phoneLoginMap`. Saat pengguna mengisi nomor ponsel di halaman login, aplikasi mencari email yang terhubung dengan nomor tersebut, lalu melakukan login menggunakan `signInWithEmailAndPassword()`.

### Fitur Utama 2 - Dashboard Saldo, Ringkasan Transaksi, dan Menu Saya

Fungsi terbaru:

1. Menampilkan nama pengguna.
2. Menampilkan saldo e-wallet.
3. Menampilkan 3 transaksi terbaru.
4. Menampilkan tombol cepat: Top Up, Pay, History, dan Saya.
5. Menu **Saya** berisi 3 submenu:
   - Profil dan Keamanan Akun
   - Trend Keuangan Pengguna
   - Pengaturan Sistem

Submenu **Profil dan Keamanan Akun** berisi:

1. Informasi data pribadi pengguna.
2. Foto profil.
3. Buat atau ubah PIN transaksi.
4. Tombol Log Out.

Submenu **Trend Keuangan Pengguna** berisi:

1. Grafik pemasukan dan pengeluaran.
2. Filter 1 hari, 3 hari, 7 hari, dan 30 hari.
3. Perhitungan pemasukan dari transaksi `topup`.
4. Perhitungan pengeluaran dari transaksi `payment`.

Submenu **Pengaturan Sistem** berisi:

1. Pengaturan notifikasi.
2. Pengaturan bahasa Indonesia/Inggris.
3. Pengaturan mode aplikasi: Mode Terang atau Mode Gelap.

### Fitur Utama 3 - Pembayaran Produk Digital Menggunakan Axios dan PIN

Fungsi terbaru:

1. Aplikasi tidak lagi menggunakan `fakestoreapi.com` karena API tersebut berisi produk umum seperti pakaian dan benda fisik.
2. Aplikasi menggunakan API produk digital buatan sendiri menggunakan MockAPI/JSON API.
3. Data produk digital berisi layanan pulsa, paket data, tagihan, dan top up e-money.
4. Pengguna dapat memilih produk digital.
5. Sebelum saldo terpotong, pengguna wajib memasukkan PIN transaksi.
6. Jika PIN benar dan saldo cukup, pembayaran berhasil.
7. Jika PIN salah, pembayaran ditolak dan saldo tidak terpotong.
8. Jika pengguna belum membuat PIN, aplikasi mengarahkan pengguna ke halaman Profil dan Keamanan Akun.

Contoh produk digital:

```ts
{
  id: "pulsa-telkomsel-20k",
  name: "Pulsa Telkomsel 20.000",
  category: "Pulsa",
  provider: "Telkomsel",
  price: 21500,
  description: "Pulsa reguler Telkomsel nominal 20.000",
  iconUrl: "https://..."
}
```

### Fitur Tambahan - Top Up Saldo

Fungsi:

1. Pengguna memasukkan nominal top up.
2. Sistem memvalidasi minimal top up Rp10.000.
3. Saldo pengguna bertambah.
4. Data top up tersimpan pada riwayat transaksi.
5. Data top up menjadi sumber pemasukan pada grafik trend keuangan.

## 4. API Produk Digital yang Digunakan

Karena API `fakestoreapi.com` tidak sesuai dengan konsep e-wallet, PayKu menggunakan API produk digital buatan sendiri.

Pilihan API yang direkomendasikan:

```txt
MockAPI.io / Mocky.io / JSON Server Online
```

Endpoint contoh:

```txt
https://NAMA_PROJECT.mockapi.io/api/v1/digital-products
```

Nama endpoint pada kode:

```ts
export const DIGITAL_PRODUCT_API_URL = "https://NAMA_PROJECT.mockapi.io/api/v1/digital-products";
```

Contoh data yang dimasukkan ke MockAPI:

```json
[
  {
    "id": "1",
    "name": "Pulsa Telkomsel 20.000",
    "category": "Pulsa",
    "provider": "Telkomsel",
    "price": 21500,
    "description": "Pulsa reguler Telkomsel nominal 20.000",
    "iconUrl": "https://cdn-icons-png.flaticon.com/512/1041/1041885.png"
  },
  {
    "id": "2",
    "name": "Paket Data 10GB",
    "category": "Paket Data",
    "provider": "Indosat",
    "price": 55000,
    "description": "Paket internet 10GB aktif 30 hari",
    "iconUrl": "https://cdn-icons-png.flaticon.com/512/4144/4144781.png"
  },
  {
    "id": "3",
    "name": "Tagihan Listrik PLN",
    "category": "Tagihan",
    "provider": "PLN",
    "price": 150000,
    "description": "Pembayaran tagihan listrik PLN pascabayar",
    "iconUrl": "https://cdn-icons-png.flaticon.com/512/2933/2933245.png"
  },
  {
    "id": "4",
    "name": "Top Up E-Money 50.000",
    "category": "E-Money",
    "provider": "E-Money",
    "price": 51000,
    "description": "Top up saldo kartu e-money nominal 50.000",
    "iconUrl": "https://cdn-icons-png.flaticon.com/512/2331/2331941.png"
  }
]
```

Alur data:

```txt
API Produk Digital -> Axios GET -> State products -> UI List Produk -> Input PIN -> Validasi Firestore -> Update Saldo -> Simpan Transaksi
```

## 5. Library yang Digunakan

```bash
npx create-expo-app payku-ewallet
cd payku-ewallet
npm install axios firebase
npx expo install expo-image-picker expo-crypto
npx expo start -c
```

Keterangan:

1. `axios` digunakan untuk HTTP request ke API produk digital.
2. `firebase` digunakan untuk Authentication, Firestore, dan Storage.
3. `expo-image-picker` digunakan untuk memilih foto profil.
4. `expo-crypto` digunakan untuk membuat hash PIN transaksi.

## 6. Struktur Folder Project Terbaru

```txt
payku-ewallet/
|-- app/
|   |-- _layout.tsx
|   |-- index.tsx
|   |-- login.tsx
|   |-- register.tsx
|   |-- pay.tsx
|   |-- topup.tsx
|   |-- history.tsx
|   |-- me.tsx
|   |-- profile-security.tsx
|   |-- trends.tsx
|   `-- settings.tsx
|-- firebase/
|   `-- firebaseConfig.ts
|-- services/
|   `-- productApi.ts
|-- types/
|   `-- index.ts
|-- utils/
|   |-- format.ts
|   `-- security.ts
`-- package.json
```

## 7. Rancangan Database Firestore Terbaru

### Collection `users`

Path:

```txt
users/{uid}
```

Field:

| Field | Tipe Data | Fungsi |
|---|---|---|
| uid | string | ID pengguna dari Firebase Authentication |
| name | string | Nama pengguna |
| email | string | Email pengguna |
| phoneNumber | string | Nomor ponsel pengguna |
| birthDate | string | Tanggal lahir format YYYY-MM-DD |
| balance | number | Saldo e-wallet |
| photoURL | string | URL foto profil dari Firebase Storage |
| transactionPinHash | string | Hash PIN transaksi |
| settings.notifications | boolean | Status notifikasi |
| settings.language | string | Bahasa aplikasi, `id` atau `en` |
| settings.theme | string | Mode aplikasi, `light` atau `dark` |
| createdAt | timestamp | Waktu akun dibuat |

### Collection `phoneLoginMap`

Path:

```txt
phoneLoginMap/{phoneNumber}
```

Field:

| Field | Tipe Data | Fungsi |
|---|---|---|
| uid | string | UID pengguna |
| email | string | Email yang terhubung dengan nomor ponsel |
| createdAt | timestamp | Waktu mapping dibuat |

### Collection `transactions`

Path:

```txt
transactions/{transactionId}
```

Field:

| Field | Tipe Data | Fungsi |
|---|---|---|
| uid | string | ID pemilik transaksi |
| type | string | `topup` atau `payment` |
| title | string | Judul transaksi |
| category | string | Kategori transaksi |
| provider | string | Provider layanan |
| amount | number | Nominal transaksi |
| status | string | `success` atau `failed` |
| createdAt | timestamp | Waktu transaksi |

## 8. Firestore Rules untuk Revisi Fitur

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow create, read, update: if request.auth != null
                                  && request.auth.uid == userId;
      allow delete: if false;
    }

    match /phoneLoginMap/{phoneNumber} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }

    match /transactions/{transactionId} {
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;

      allow read: if request.auth != null
                  && resource.data.uid == request.auth.uid;

      allow update, delete: if false;
    }
  }
}
```

Catatan:

Rules `phoneLoginMap` dibuat `read: if true` supaya halaman login bisa mencari email berdasarkan nomor ponsel sebelum pengguna berhasil login. Untuk aplikasi produksi, mekanisme ini lebih aman jika dipindahkan ke server atau Cloud Functions.

## 9. Storage Rules untuk Foto Profil

```txt
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{userId}.jpg {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 10. Kode Inti Revisi

### firebase/firebaseConfig.ts

```ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "ISI_AUTH_DOMAIN",
  projectId: "ISI_PROJECT_ID",
  storageBucket: "ISI_STORAGE_BUCKET",
  messagingSenderId: "ISI_MESSAGING_SENDER_ID",
  appId: "ISI_APP_ID",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### types/index.ts

```ts
export type DigitalProduct = {
  id: string;
  name: string;
  category: "Pulsa" | "Paket Data" | "Tagihan" | "E-Money" | string;
  provider: string;
  price: number;
  description: string;
  iconUrl: string;
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  balance: number;
  photoURL: string;
  transactionPinHash: string;
  settings: {
    notifications: boolean;
    language: "id" | "en";
    theme: "light" | "dark";
  };
  createdAt: any;
};

export type WalletTransaction = {
  id?: string;
  uid: string;
  type: "topup" | "payment";
  title: string;
  category?: string;
  provider?: string;
  amount: number;
  status: "success" | "failed";
  createdAt: any;
};
```

### utils/format.ts

```ts
export const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
};
```

### utils/security.ts

```ts
import * as Crypto from "expo-crypto";

export const normalizePhone = (value: string) => {
  let phone = value.replace(/\D/g, "");

  if (phone.startsWith("0")) {
    phone = "62" + phone.substring(1);
  }

  return phone;
};

export const looksLikePhone = (value: string) => {
  const text = value.trim();
  return !text.includes("@") && /^[0-9+\-\s]+$/.test(text);
};

export const isBirthDateAllowed = (birthDate: string) => {
  const date = new Date(`${birthDate}T00:00:00`);
  const limitDate = new Date("2010-01-01T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date < limitDate;
};

export const isPinValid = (pin: string) => {
  return /^\d{6}$/.test(pin);
};

export const hashPin = async (pin: string) => {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    pin
  );
};
```

### services/productApi.ts

```ts
import axios from "axios";
import { DigitalProduct } from "../types";

export const DIGITAL_PRODUCT_API_URL =
  "https://NAMA_PROJECT.mockapi.io/api/v1/digital-products";

export const productApi = axios.create({
  baseURL: DIGITAL_PRODUCT_API_URL,
  timeout: 10000,
});

export const getDigitalProducts = async (): Promise<DigitalProduct[]> => {
  const response = await productApi.get("");
  return response.data;
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
      <Stack.Screen name="me" />
      <Stack.Screen name="profile-security" />
      <Stack.Screen name="trends" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
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
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { isBirthDateAllowed, normalizePhone } from "../utils/security";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    try {
      if (!name || !email || !phoneNumber || !birthDate || !password) {
        Alert.alert("Peringatan", "Semua data wajib diisi");
        return;
      }

      if (!isBirthDateAllowed(birthDate)) {
        Alert.alert(
          "Registrasi ditolak",
          "Tanggal lahir harus sebelum 1 Januari 2010"
        );
        return;
      }

      if (password.length < 6) {
        Alert.alert("Peringatan", "Password minimal 6 karakter");
        return;
      }

      setLoading(true);

      const normalizedPhone = normalizePhone(phoneNumber);

      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: name.trim(),
        email: email.trim(),
        phoneNumber: normalizedPhone,
        birthDate,
        balance: 0,
        photoURL: "",
        transactionPinHash: "",
        settings: {
          notifications: true,
          language: "id",
          theme: "light",
        },
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "phoneLoginMap", normalizedPhone), {
        uid: credential.user.uid,
        email: email.trim(),
        createdAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Akun berhasil dibuat");
      router.replace("/");
    } catch (error: any) {
      console.log("REGISTER ERROR CODE:", error.code);
      console.log("REGISTER ERROR MESSAGE:", error.message);
      Alert.alert(
        "Registrasi gagal",
        `Kode: ${error.code}\n${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>PayKu</Text>
      <Text style={styles.title}>Daftar Akun Baru</Text>

      <TextInput
        style={styles.input}
        placeholder="Nama lengkap"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Nomor ponsel, contoh: 08123456789"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Tanggal lahir, contoh: 2005-08-17"
        value={birthDate}
        onChangeText={setBirthDate}
      />
      <Text style={styles.note}>Hanya pengguna lahir sebelum 1 Januari 2010 yang bisa register.</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={registerUser} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Memproses..." : "Daftar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FAF8",
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0B8F6A",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10231D",
    marginTop: 20,
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  note: {
    fontSize: 12,
    color: "#5B6B65",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0B8F6A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#0B8F6A",
    fontWeight: "700",
    marginTop: 18,
    marginBottom: 30,
  },
});
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
} from "react-native";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { looksLikePhone, normalizePhone } from "../utils/security";

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resolveEmail = async () => {
    if (looksLikePhone(identifier)) {
      const phone = normalizePhone(identifier);
      const phoneSnap = await getDoc(doc(db, "phoneLoginMap", phone));

      if (!phoneSnap.exists()) {
        throw new Error("Nomor ponsel tidak terdaftar");
      }

      return phoneSnap.data().email;
    }

    return identifier.trim();
  };

  const loginUser = async () => {
    try {
      if (!identifier || !password) {
        Alert.alert("Peringatan", "Email/nomor ponsel dan password wajib diisi");
        return;
      }

      setLoading(true);
      const email = await resolveEmail();

      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.message);
      Alert.alert("Login gagal", error.message || "Akun tidak dapat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PayKu</Text>
      <Text style={styles.title}>Login E-Wallet</Text>
      <Text style={styles.subtitle}>Masuk menggunakan email atau nomor ponsel</Text>

      <TextInput
        style={styles.input}
        placeholder="Email atau nomor ponsel"
        value={identifier}
        onChangeText={setIdentifier}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={loginUser} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Memproses..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Daftar sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FAF8",
    padding: 20,
    paddingTop: 90,
  },
  logo: {
    fontSize: 40,
    fontWeight: "900",
    color: "#0B8F6A",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10231D",
    marginTop: 32,
  },
  subtitle: {
    color: "#5B6B65",
    marginTop: 6,
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7E3DD",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0B8F6A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#0B8F6A",
    fontWeight: "700",
    marginTop: 18,
  },
});
```

### app/index.tsx - Dashboard dengan Menu Saya

```tsx
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
import { auth, db } from "../firebase/firebaseConfig";
import { UserProfile, WalletTransaction } from "../types";
import { formatRupiah } from "../utils/format";

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
      <Text style={styles.subtitle}>Selamat datang di PayKu</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo PayKu</Text>
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
```

### app/me.tsx - Menu Saya

```tsx
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
```

### app/profile-security.tsx

```tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase/firebaseConfig";
import { UserProfile } from "../types";
import { hashPin, isPinValid } from "../utils/security";

export default function ProfileSecurityScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const loadProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      setProfile(snap.data() as UserProfile);
    }
  };

  const pickProfilePhoto = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageRef = ref(storage, `profiles/${user.uid}.jpg`);

      await uploadBytes(imageRef, blob);
      const photoURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", user.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      Alert.alert("Berhasil", "Foto profil berhasil diperbarui");
      loadProfile();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Foto profil gagal diperbarui");
    }
  };

  const savePin = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      if (!isPinValid(pin)) {
        Alert.alert("Peringatan", "PIN harus terdiri dari 6 digit angka");
        return;
      }

      if (pin !== confirmPin) {
        Alert.alert("Peringatan", "Konfirmasi PIN tidak sama");
        return;
      }

      const pinHash = await hashPin(pin);

      await updateDoc(doc(db, "users", user.uid), {
        transactionPinHash: pinHash,
        updatedAt: serverTimestamp(),
      });

      setPin("");
      setConfirmPin("");
      Alert.alert("Berhasil", "PIN transaksi berhasil disimpan");
      loadProfile();
    } catch (error: any) {
      Alert.alert("Error", error.message || "PIN gagal disimpan");
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profil dan Keamanan</Text>

      <View style={styles.profileBox}>
        {profile?.photoURL ? (
          <Image source={{ uri: profile.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>Foto</Text></View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={pickProfilePhoto}>
          <Text style={styles.secondaryButtonText}>Ubah Foto Profil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Nama</Text>
        <Text style={styles.infoValue}>{profile?.name}</Text>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{profile?.email}</Text>
        <Text style={styles.infoLabel}>Nomor Ponsel</Text>
        <Text style={styles.infoValue}>{profile?.phoneNumber}</Text>
        <Text style={styles.infoLabel}>Tanggal Lahir</Text>
        <Text style={styles.infoValue}>{profile?.birthDate}</Text>
        <Text style={styles.infoLabel}>Status PIN</Text>
        <Text style={styles.infoValue}>{profile?.transactionPinHash ? "Sudah dibuat" : "Belum dibuat"}</Text>
      </View>

      <Text style={styles.sectionTitle}>Buat/Ubah PIN Transaksi</Text>
      <TextInput
        style={styles.input}
        placeholder="PIN 6 digit"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
      />
      <TextInput
        style={styles.input}
        placeholder="Konfirmasi PIN"
        value={confirmPin}
        onChangeText={setConfirmPin}
        secureTextEntry
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={savePin}>
        <Text style={styles.buttonText}>Simpan PIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF8", padding: 20, paddingTop: 55 },
  title: { fontSize: 26, fontWeight: "900", color: "#10231D", marginBottom: 16 },
  profileBox: { alignItems: "center", marginBottom: 18 },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#E8F7F1" },
  avatarPlaceholder: { width: 110, height: 110, borderRadius: 55, backgroundColor: "#D7E3DD", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#5B6B65", fontWeight: "800" },
  secondaryButton: { marginTop: 10, backgroundColor: "#E8F7F1", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  secondaryButtonText: { color: "#0B8F6A", fontWeight: "800" },
  infoCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#D7E3DD" },
  infoLabel: { color: "#5B6B65", marginTop: 8 },
  infoValue: { color: "#10231D", fontWeight: "800", marginTop: 2 },
  sectionTitle: { marginTop: 20, marginBottom: 10, fontSize: 18, fontWeight: "900", color: "#10231D" },
  input: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#D7E3DD", borderRadius: 12, padding: 14, marginBottom: 12 },
  button: { backgroundColor: "#0B8F6A", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontWeight: "900" },
  logoutButton: { backgroundColor: "#FDECEC", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 12, marginBottom: 40 },
  logoutText: { color: "#C23B3B", fontWeight: "900" },
});
```

### app/trends.tsx

```tsx
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
```

### app/settings.tsx

```tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const loadSettings = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    const settings = snap.data()?.settings;

    if (settings) {
      setNotifications(settings.notifications);
      setLanguage(settings.language);
      setTheme(settings.theme);
    }
  };

  const saveSettings = async (newSettings: {
    notifications?: boolean;
    language?: "id" | "en";
    theme?: "light" | "dark";
  }) => {
    const user = auth.currentUser;
    if (!user) return;

    const updated = {
      notifications,
      language,
      theme,
      ...newSettings,
    };

    setNotifications(updated.notifications);
    setLanguage(updated.language);
    setTheme(updated.theme);

    await updateDoc(doc(db, "users", user.uid), {
      settings: updated,
    });
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View style={[styles.container, theme === "dark" && styles.darkContainer]}>
      <Text style={[styles.title, theme === "dark" && styles.darkText]}>Pengaturan Sistem</Text>

      <View style={[styles.card, theme === "dark" && styles.darkCard]}>
        <Text style={[styles.cardTitle, theme === "dark" && styles.darkText]}>Notifikasi</Text>
        <Switch
          value={notifications}
          onValueChange={(value) => saveSettings({ notifications: value })}
        />
      </View>

      <View style={[styles.card, theme === "dark" && styles.darkCard]}>
        <Text style={[styles.cardTitle, theme === "dark" && styles.darkText]}>Bahasa</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity style={language === "id" ? styles.activeOption : styles.option} onPress={() => saveSettings({ language: "id" })}>
            <Text style={language === "id" ? styles.activeOptionText : styles.optionText}>Indonesia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={language === "en" ? styles.activeOption : styles.option} onPress={() => saveSettings({ language: "en" })}>
            <Text style={language === "en" ? styles.activeOptionText : styles.optionText}>English</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, theme === "dark" && styles.darkCard]}>
        <Text style={[styles.cardTitle, theme === "dark" && styles.darkText]}>Mode Aplikasi</Text>
        <View style={styles.optionRow}>
          <TouchableOpacity style={theme === "light" ? styles.activeOption : styles.option} onPress={() => saveSettings({ theme: "light" })}>
            <Text style={theme === "light" ? styles.activeOptionText : styles.optionText}>Terang</Text>
          </TouchableOpacity>
          <TouchableOpacity style={theme === "dark" ? styles.activeOption : styles.option} onPress={() => saveSettings({ theme: "dark" })}>
            <Text style={theme === "dark" ? styles.activeOptionText : styles.optionText}>Gelap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF8", padding: 20, paddingTop: 55 },
  darkContainer: { backgroundColor: "#10231D" },
  title: { fontSize: 26, fontWeight: "900", color: "#10231D", marginBottom: 18 },
  darkText: { color: "#FFFFFF" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#D7E3DD" },
  darkCard: { backgroundColor: "#18362D", borderColor: "#265445" },
  cardTitle: { fontSize: 16, fontWeight: "900", color: "#10231D", marginBottom: 12 },
  optionRow: { flexDirection: "row", gap: 10 },
  option: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#D7E3DD", backgroundColor: "#FFFFFF" },
  activeOption: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: "#0B8F6A" },
  optionText: { color: "#0B8F6A", fontWeight: "800" },
  activeOptionText: { color: "#FFFFFF", fontWeight: "800" },
});
```

### app/pay.tsx - Pembayaran Produk Digital dengan PIN

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
  Modal,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { collection, doc, getDoc, runTransaction, serverTimestamp } from "firebase/firestore";
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
      const data = await getDigitalProducts();
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
```

## 11. Perubahan pada Fitur yang Didemokan

### Demo Fitur 1 - Login/Register Pengguna

Alur demo:

1. Buka halaman Register.
2. Isi nama, email, nomor ponsel, tanggal lahir, dan password.
3. Coba isi tanggal lahir setelah 1 Januari 2010, aplikasi harus menolak registrasi.
4. Isi tanggal lahir sebelum 1 Januari 2010, aplikasi mengizinkan registrasi.
5. Data akun masuk ke Firebase Authentication.
6. Data profil masuk ke Firestore collection `users`.
7. Data nomor ponsel masuk ke collection `phoneLoginMap`.
8. Logout.
9. Login kembali menggunakan email.
10. Logout lagi.
11. Login kembali menggunakan nomor ponsel.

### Demo Fitur 2 - Dashboard dan Menu Saya

Alur demo:

1. Setelah login, dashboard menampilkan nama dan saldo.
2. Tampilkan transaksi terbaru.
3. Klik menu **Saya**.
4. Buka **Profil dan Keamanan Akun**.
5. Tampilkan data pribadi, foto profil, PIN transaksi, dan logout.
6. Buka **Trend Keuangan Pengguna**.
7. Tampilkan grafik 1 hari, 3 hari, 7 hari, dan 30 hari.
8. Buka **Pengaturan Sistem**.
9. Ubah notifikasi, bahasa, dan mode aplikasi.

### Demo Fitur 3 - Pembayaran Produk Digital Menggunakan Axios dan PIN

Alur demo:

1. Buka halaman Pay.
2. Tekan **Load Produk Digital API**.
3. Axios mengambil data dari API produk digital.
4. Data masuk ke state `products`.
5. UI menampilkan daftar pulsa, paket data, tagihan, dan e-money.
6. Pilih salah satu produk.
7. Masukkan PIN salah, pembayaran harus ditolak.
8. Masukkan PIN benar, saldo berkurang.
9. Data transaksi tersimpan di Firestore collection `transactions`.
10. Transaksi terlihat pada halaman History dan Trend Keuangan.

## 12. Pembagian Tugas Tim Skenario B Versi Revisi

| Anggota | Peran | Tugas | Tanggung Jawab Demo |
|---|---|---|---|
| Anggota 1 | Frontend & Axios Specialist | Membuat UI/UX dashboard, menu Saya, halaman Pay, halaman Trends, Settings, dan integrasi Axios ke API produk digital | Menjelaskan desain UI, navigasi halaman, responsif layout, loading/error state, dan alur API -> Axios -> State -> UI pada fitur Pay dan Trend |
| Anggota 2 | Backend, State & Firebase Specialist | Setup Firebase Auth, Firestore, Storage, validasi register, login email/nomor ponsel, PIN transaksi, update saldo, dan transaksi | Menjelaskan Authentication, Firestore schema, Storage foto profil, validasi PIN, update saldo, rules database, dan state lokal aplikasi |

Rekomendasi commit Git:

| Commit | Anggota | Isi Commit |
|---|---|---|
| commit 1 | Anggota 1 | Membuat UI login, register, dashboard, dan menu Saya |
| commit 2 | Anggota 2 | Setup Firebase Auth, Firestore, Storage, dan rules |
| commit 3 | Anggota 2 | Menambahkan register nomor ponsel, tanggal lahir, dan login email/nomor ponsel |
| commit 4 | Anggota 1 | Membuat API produk digital dan halaman Pay dengan Axios |
| commit 5 | Anggota 2 | Menambahkan PIN transaksi, update saldo, dan simpan transaksi |
| commit 6 | Anggota 1 | Membuat Trend Keuangan dan Pengaturan Sistem |
| commit 7 | Anggota 1 dan 2 | Finalisasi UI/UX, error handling, dan dokumentasi README |

## 13. Catatan Keamanan

1. PIN transaksi tidak disimpan dalam bentuk teks asli, melainkan disimpan dalam bentuk hash SHA-256.
2. Saldo diperbarui menggunakan `runTransaction()` agar lebih aman dari benturan proses update.
3. Rules Firestore membatasi user hanya dapat membaca dan mengubah data miliknya sendiri.
4. Collection `phoneLoginMap` hanya digunakan untuk kebutuhan praktikum agar login nomor ponsel dapat dilakukan tanpa SMS OTP.
5. Untuk aplikasi e-wallet sungguhan, transaksi saldo sebaiknya diproses melalui backend server atau Cloud Functions, bukan langsung dari aplikasi client.

## 14. Kesimpulan Revisi

Versi revisi aplikasi PayKu memiliki fitur yang lebih sesuai dengan kebutuhan e-wallet, yaitu autentikasi dengan data pengguna lengkap, login menggunakan email atau nomor ponsel, validasi usia berdasarkan tanggal lahir, dashboard saldo, menu Saya, profil dan keamanan akun, PIN transaksi, trend keuangan, pengaturan sistem, serta pembayaran produk digital menggunakan Axios. API `fakestoreapi.com` diganti menjadi API produk digital buatan sendiri agar data yang ditampilkan lebih relevan dengan layanan e-wallet seperti pulsa, paket data, tagihan, dan top up e-money.
