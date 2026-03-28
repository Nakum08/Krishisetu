import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const NutritionInfo = ({ expanded, setExpanded, product }) => {
  const { t } = useTranslation();
  
  return (
    <View style={styles.detailsContainer}>
      <TouchableOpacity 
        style={styles.detailsHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.detailsTitle}>{t('productDetails.nutritionInformation')}</Text>
      <Ionicons 
        name={expanded ? "chevron-up" : "chevron-down"} 
        size={24} 
        color="#666"
      />
    </TouchableOpacity>
    
    {expanded && (
      <View style={styles.nutritionContainer}>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionLabel}>{t('productDetails.calories')}:</Text>
          <Text style={styles.nutritionValue}>{product.nutritionInfo?.calories}</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionLabel}>{t('productDetails.protein')}:</Text>
          <Text style={styles.nutritionValue}>{product.nutritionInfo?.protein}</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionLabel}>{t('productDetails.carbs')}:</Text>
          <Text style={styles.nutritionValue}>{product.nutritionInfo?.carbs}</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionLabel}>{t('productDetails.fiber')}:</Text>
          <Text style={styles.nutritionValue}>{product.nutritionInfo?.fiber}</Text>
        </View>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionLabel}>{t('productDetails.fat')}:</Text>
          <Text style={styles.nutritionValue}>{product.nutritionInfo?.fat}</Text>
        </View>
        
        <Text style={styles.vitaminsTitle}>{t('productDetails.vitaminsMinerals')}:</Text>
        <View style={styles.vitaminsContainer}>
          {(product.nutritionInfo?.vitamins || []).map((vitamin, index) => (
            <View key={`vitamin-${index}`} style={styles.vitaminTag}>
              <Text style={styles.vitaminText}>{vitamin}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.nutritionNote}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.noteText}>
            Values based on 100g serving. Natural variations may occur due to farming conditions.
          </Text>
        </View>
      </View>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginBottom: s(8),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
  },
  detailsTitle: {
    fontSize: ms(16),
    fontWeight: '600',
    color: '#333',
  },
  nutritionContainer: {
    padding: s(16),
    paddingTop: s(0),
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: s(6),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabel: {
    fontSize: ms(14),
    color: '#666',
  },
  nutritionValue: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#333',
  },
  vitaminsTitle: {
    fontSize: ms(14),
    fontWeight: '500',
    color: '#333',
    marginTop: s(12),
    marginBottom: s(8),
  },
  vitaminsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: s(12),
  },
  vitaminTag: {
    paddingVertical: s(4),
    paddingHorizontal: s(8),
    backgroundColor: '#e8f5e9',
    borderRadius: ms(12),
    marginRight: s(8),
    marginBottom: s(8),
  },
  vitaminText: {
    fontSize: ms(12),
    color: '#4CAF50',
  },
  nutritionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: s(8),
    backgroundColor: '#fff9e6',
    padding: s(8),
    borderRadius: ms(8),
  },
  noteText: {
    fontSize: ms(12),
    color: '#666',
    marginLeft: s(6),
    flex: 1,
  },
});

export default NutritionInfo;