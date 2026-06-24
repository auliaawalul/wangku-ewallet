import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from './LanguageContext'; // 👈 Hubungkan ke Pusat Bahasa

export default function ModalScreen() {
  const { t } = useLanguage(); // 👈 Ambil kamus terjemahan global

  return (
    <View style={styles.container}>
      {/* Garis kecil penanda modal bisa di-swipe down di iOS */}
      <View style={styles.swipeIndicator} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Icon & Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="help-buoy" size={40} color="#0A9396" />
          </View>
          <Text style={styles.title}>{t.modalTitle}</Text>
          <Text style={styles.subtitle}>{t.modalSubtitle}</Text>
        </View>

        {/* Info Kontak Cepat */}
        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Ionicons name="mail" size={20} color="#0A9396" />
            <Text style={styles.contactText}>support@wangku.com</Text>
          </View>
          <View style={[styles.contactRow, { marginTop: 12 }]}>
            <Ionicons name="call" size={20} color="#0A9396" />
            <Text style={styles.contactText}>0800-140-WANGKU (Bebas Pulsa)</Text>
          </View>
        </View>

        {/* Bagian FAQ */}
        <Text style={styles.sectionTitle}>{t.faqTitle}</Text>

        {/* FAQ Item 1 */}
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>🔹 {t.faq1}</Text>
          <Text style={styles.faqAnswer}>{t.faq1Desc}</Text>
        </View>

        {/* FAQ Item 2 */}
        <View style={styles.faqCard}>
          <Text style={styles.faqQuestion}>🔹 {t.faq2}</Text>
          <Text style={styles.faqAnswer}>{t.faq2Desc}</Text>
        </View>
      </ScrollView>

      {/* Tombol Back yang rapi dan responsif */}
      <Link href="/" dismissTo asChild>
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeButtonText}>{t.closeBtn}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  swipeIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 28,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0A9396',
    marginBottom: 6,
  },
  faqText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  closeButton: {
    backgroundColor: '#0A9396',
    margin: 24,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#0A9396',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});