# Aplikasi Mobile E-Wallet Berbasis Expo, Axios, dan Firebase

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
1. Menggunakan Axios untuk HTTP request ke API publik.
2. Menggunakan Firebase Authentication dan Cloud Firestore.
3. Memiliki 3 fitur utama yang jelas dan berfungsi.
4. Memiliki 1 fitur tambahan yang mendukung fungsi e-wallet.
5. Pembagian tugas mengikuti Skenario B untuk tim berisi 2 orang.
6. UI/UX dibuat responsif dengan card saldo, list produk, tombol aksi, loading state, empty state, dan error state.
