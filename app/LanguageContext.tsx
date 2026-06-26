import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';

// 1. Kamus Besar untuk SELURUH Halaman Aplikasi
export const globalTranslations = {
  id: {
    // Navigasi Menu Bawah (Tabs)
    tabDashboard: "Dashboard",
    tabRiwayat: "Riwayat",
    tabPengaturan: "Pengaturan",
    tabProfil: "Profil",

    // Halaman Settings
    settingsTitle: "Pengaturan",
    sectionApp: "PREFERENSI APLIKASI",
    notif: "Notifikasi Transaksi",
    lang: "Bahasa Utama",
    theme: "Mode Gelap",
    logout: "Keluar Akun",
    logoutDesc: "Apakah Anda yakin ingin keluar dari aplikasi WangKu?",
    cancel: "Batal",
    
    // Halaman Dashboard & Profil
    welcome: "Selamat Datang,",
    balance: "Total Saldo Anda",
    copy: "Salin",
    transferBtn: "Transfer",
    topupBtn: "Top Up",
    payBtn: "Pembayaran",
    modalBtn: "Modal",
    historyTitle: "Riwayat Transaksi Terbaru",
    emptyHistory: "Belum ada transaksi masuk atau keluar.",
  },
  en: {
    // Navigasi Menu Bawah (Tabs)
    tabDashboard: "Dashboard",
    tabRiwayat: "History",
    tabPengaturan: "Settings",
    tabProfil: "Profile",

    // Halaman Settings
    settingsTitle: "Settings",
    sectionApp: "APPLICATION PREFERENCES",
    notif: "Transaction Notifications",
    lang: "Primary Language",
    theme: "Dark Mode",
    logout: "Log Out",
    logoutDesc: "Are you sure you want to log out from WangKu?",
    cancel: "Cancel",
    
    // Halaman Dashboard & Profil
    welcome: "Welcome,",
    balance: "Your Total Balance",
    copy: "Copy",
    transferBtn: "Transfer",
    topupBtn: "Top Up",
    payBtn: "Payment",
    modalBtn: "Capital",
    historyTitle: "Recent Transaction History",
    emptyHistory: "No incoming or outgoing transactions yet.",
  }
};
type LanguageType = 'id' | 'en';

interface LanguageContextProps {
  language: LanguageType;
  changeLanguage: (lang: LanguageType) => Promise<void>;
  t: typeof globalTranslations['id'];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageType>('id');
  const auth = getAuth();

  // Ambil setting bahasa user dari Firebase saat aplikasi pertama dibuka
  useEffect(() => {
    const loadFirebaseLanguage = async () => {
      const user = auth.currentUser;
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        const savedLang = snap.data()?.settings?.language;
        if (savedLang) setLanguage(savedLang);
      }
    };
    loadFirebaseLanguage();
  }, []);

  const changeLanguage = async (lang: LanguageType) => {
    setLanguage(lang);
    const user = auth.currentUser;
    if (user) {
      try {
        // Langsung update ke Firebase agar tersimpan permanen
        await updateDoc(doc(db, "users", user.uid), {
          "settings.language": lang
        });
      } catch (error) {
        console.log("Gagal save bahasa ke Firebase:", error);
      }
    }
  };

  const t = globalTranslations[language];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage harus digunakan di dalam LanguageProvider');
  return context;
}