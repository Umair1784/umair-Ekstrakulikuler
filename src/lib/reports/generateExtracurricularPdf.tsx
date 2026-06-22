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
  cellSmall: { padding: 5, borderRight: 1, borderColor: '#eee', width: 60 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: '#999', fontSize: 8 },
});

type ExtracurricularData = {
  name: string;
  status: string;
  coach: { fullName: string };
  _count: { memberships: number };
};

export const ExtracurricularPdfDocument = ({ data }: { data: ExtracurricularData[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Laporan Data Ekstrakurikuler</Text>
        <Text style={styles.subtitle}>SMA Negeri Contoh</Text>
        <Text style={styles.subtitle}>Dicetak pada: {new Date().toLocaleDateString('id-ID')}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.cell}>Nama Ekstrakurikuler</Text>
          <Text style={styles.cell}>Pembina</Text>
          <Text style={styles.cellSmall}>Anggota</Text>
          <Text style={styles.cellSmall}>Status</Text>
        </View>
        {data.map((item, i) => (
          <View style={styles.row} key={i}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.coach.fullName}</Text>
            <Text style={styles.cellSmall}>{item._count.memberships}</Text>
            <Text style={styles.cellSmall}>{item.status}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footer} render={({ pageNumber, totalPages }) => `Halaman ${pageNumber} dari ${totalPages}`} fixed />
    </Page>
  </Document>
);
