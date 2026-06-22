import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, textAlign: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 10, color: '#666' },
  table: { display: 'flex', flexDirection: 'column', width: '100%', marginTop: 10, borderTop: 1, borderLeft: 1, borderColor: '#eee' },
  row: { display: 'flex', flexDirection: 'row', borderBottom: 1, borderColor: '#eee' },
  headerRow: { display: 'flex', flexDirection: 'row', backgroundColor: '#f8f9fa', borderBottom: 1, borderColor: '#eee', fontWeight: 'bold' },
  cell: { padding: 5, borderRight: 1, borderColor: '#eee', flex: 1 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: '#999', fontSize: 8 },
});

type AttendanceItem = {
  status: string;
  student: { fullName: string };
  session: { sessionDate: string | Date; extracurricular: { name: string } };
};

export const AttendancePdfDocument = ({ data }: { data: AttendanceItem[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Laporan Kehadiran Ekstrakurikuler</Text>
        <Text style={styles.subtitle}>SMA Negeri Contoh</Text>
        <Text style={styles.subtitle}>Dicetak pada: {new Date().toLocaleDateString('id-ID')}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.cell}>Nama Siswa</Text>
          <Text style={styles.cell}>Ekstrakurikuler</Text>
          <Text style={styles.cell}>Tanggal</Text>
          <Text style={styles.cell}>Status</Text>
        </View>
        {data.map((item, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.cell}>{item.student.fullName}</Text>
            <Text style={styles.cell}>{item.session.extracurricular.name}</Text>
            <Text style={styles.cell}>{new Date(item.session.sessionDate).toLocaleDateString('id-ID')}</Text>
            <Text style={styles.cell}>{item.status}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} fixed />
    </Page>
  </Document>
);
