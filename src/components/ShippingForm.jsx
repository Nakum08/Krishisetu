import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const ShippingForm = ({ shippingInfo, setShippingInfo }) => {
  const { t } = useTranslation();
  
  const updateField = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('shipping.shippingInformation')}</Text>
      
      <View style={styles.formGroup}>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={18} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('shipping.fullName')}
            value={shippingInfo.fullName}
            onChangeText={(text) => updateField('fullName', text)}
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={18} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('shipping.phoneNumber')}
            keyboardType="phone-pad"
            value={shippingInfo.phoneNumber}
            onChangeText={(text) => updateField('phoneNumber', text)}
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <View style={styles.inputWrapper}>
          <Ionicons name="home-outline" size={18} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('shipping.address')}
            value={shippingInfo.address}
            onChangeText={(text) => updateField('address', text)}
          />
        </View>
      </View>
      
      <View style={styles.formRow}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <View style={styles.inputWrapper}>
            <Ionicons name="business-outline" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('shipping.city')}
              value={shippingInfo.city}
              onChangeText={(text) => updateField('city', text)}
            />
          </View>
        </View>
        
        <View style={[styles.formGroup, styles.halfWidth]}>
          <View style={styles.inputWrapper}>
            <Ionicons name="location-outline" size={18} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('shipping.pincode')}
              keyboardType="number-pad"
              value={shippingInfo.pincode}
              onChangeText={(text) => updateField('pincode', text)}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <View style={styles.inputWrapper}>
          <Ionicons name="navigate-outline" size={18} color="#999" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('shipping.landmarkOptional')}
            value={shippingInfo.landmark}
            onChangeText={(text) => updateField('landmark', text)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: s(20),
    backgroundColor: '#fff',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: ms(18),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: s(16),
  },
  formGroup: {
    marginBottom: s(14),
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: s(8),
  },
  input: {
    flex: 1,
    paddingVertical: s(12),
    fontSize: ms(15),
    color: '#333',
  },
});

export default ShippingForm;