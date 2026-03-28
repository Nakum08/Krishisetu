import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CertificationsSection = ({ certifications }) => {
  const [expanded, setExpanded] = useState(false);
  if (!certifications || certifications.length === 0) return null;
  
  return (
    <View style={styles.detailsContainer}>
      <TouchableOpacity 
        style={styles.detailsHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.detailsTitle}>Certifications</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#666"
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.certificationsContainer}>
          {certifications.map((cert, index) => (
            <View key={`cert-${index}`} style={styles.certificationBadge}>
              <Ionicons name="shield-checkmark" size={18} color="#4CAF50" />
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f1f8e9',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0f0e0',
  },
  certificationText: {
    fontSize: 13,
    color: '#4CAF50',
    marginLeft: 6,
  },
});

export default CertificationsSection;
