import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Certifications = ({ showCertifications, setShowCertifications }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.detailsContainer}>
      <TouchableOpacity 
        style={styles.detailsHeader}
        onPress={() => setShowCertifications(!showCertifications)}
      >
        <Text style={styles.detailsTitle}>{t('productDetails.certifications')}</Text>
      <Ionicons 
        name={showCertifications ? "chevron-up" : "chevron-down"} 
        size={24} 
        color="#666"
      />
    </TouchableOpacity>
    
    {showCertifications && (
      <View style={styles.certificationContainer}>
        <View style={styles.certificationsRow}>
          <View style={styles.certificationBadge}>
            <Ionicons name="shield-checkmark" size={18} color="#4CAF50" />
            <Text style={styles.certificationText}>{t('productDetails.organicCertified')}</Text>
          </View>
          <View style={styles.certificationBadge}>
            <Ionicons name="globe-outline" size={18} color="#2196F3" />
            <Text style={styles.certificationText}>{t('productDetails.rainforestAlliance')}</Text>
          </View>
        </View>
      </View>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginBottom: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  certificationContainer: {
    padding: 16,
    paddingTop: 0,
  },
  certificationsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f8e9',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  certificationText: {
    fontSize: 13,
    color: '#4CAF50',
    marginLeft: 6,
  },
});

export default Certifications;
