import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SeasonalAvailability = ({ product }) => {
  const { t } = useTranslation();
  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
  
  const getCurrentSeason = () => {
    const winterMonths = ['Dec', 'Jan', 'Feb'];
    const springMonths = ['Mar', 'Apr', 'May'];
    const summerMonths = ['Jun', 'Jul', 'Aug'];
    const monsoonMonths = ['Sep', 'Oct', 'Nov'];
    
    if (winterMonths.includes(currentMonth)) return t('productDetails.winter');
    if (springMonths.includes(currentMonth)) return t('productDetails.spring');
    if (summerMonths.includes(currentMonth)) return t('productDetails.summer');
    if (monsoonMonths.includes(currentMonth)) return t('productDetails.monsoon');
    return t('productDetails.summer'); // Default
  };

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.detailsHeader}>
        <Text style={styles.detailsTitle}>{t('productDetails.seasonalAvailability')}</Text>
      </View>
      <View style={styles.seasonalContainer}>
        <View style={styles.seasonLegendContainer}>
          {[
            { name: t('productDetails.winter'), color: '#e1f5fe', textColor: '#0288d1' },
            { name: t('productDetails.spring'), color: '#f1f8e9', textColor: '#7cb342' },
            { name: t('productDetails.summer'), color: '#fff3e0', textColor: '#ff9800' },
            { name: t('productDetails.monsoon'), color: '#e0f2f1', textColor: '#00897b' },
          ].map((season) => (
            <View key={`legend-${season.name}`} style={styles.seasonLegendItem}>
              <View 
                style={[styles.seasonColorBox, { backgroundColor: season.color, borderColor: season.textColor }]} 
              />
              <Text style={[styles.seasonLegendText, { color: season.textColor }]}>{season.name}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.monthsContainer}>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
            let seasonColor = '#f8f8f8';
            let textColor = '#999';
            let isAvailable = false;
            
            // Check if this month is in the product's seasonalMonths array
            isAvailable = (product.seasonalMonths || []).includes(month);
            
            // Apply season colors
            if (index === 0 || index === 1 || index === 11) {
              seasonColor = '#e1f5fe';
              textColor = '#0288d1';
            } else if (index >= 2 && index <= 4) {
              seasonColor = '#f1f8e9';
              textColor = '#7cb342';
            } else if (index >= 5 && index <= 7) {
              seasonColor = '#fff3e0';
              textColor = '#ff9800';
            } else if (index >= 8 && index <= 10) {
              seasonColor = '#e0f2f1';
              textColor = '#00897b';
            }
            
            return (
              <View 
                key={`month-${index}`} 
                style={[
                  styles.monthItem,
                  { backgroundColor: isAvailable ? seasonColor : '#f8f8f8' },
                  { borderColor: isAvailable ? textColor : '#f0f0f0' },
                ]}
              >
                <Text style={[
                  styles.monthText,
                  { 
                    color: isAvailable ? textColor : '#999',
                    fontWeight: isAvailable ? '500' : 'normal',
                  },
                ]}>
                  {month}
                </Text>
                {isAvailable && (
                  <View style={[styles.availabilityDot, { backgroundColor: textColor }]} />
                )}
              </View>
            );
          })}
        </View>
        
        <View style={styles.currentSeason}>
          <Ionicons name="calendar" size={16} color="#4CAF50" />
          <Text style={styles.currentSeasonText}>
            {t('productDetails.currentSeason')}: <Text style={{ fontWeight: 'bold' }}>{getCurrentSeason()}</Text>
          </Text>
        </View>
        
        <View style={styles.seasonalNote}>
          <Ionicons name="information-circle-outline" size={16} color="#666" />
          <Text style={styles.noteText}>
            {t('productDetails.produceFreshest')}
          </Text>
        </View>
      </View>
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
  seasonalContainer: {
    padding: 16,
  },
  seasonLegendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  seasonLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  seasonColorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    marginRight: 4,
  },
  seasonLegendText: {
    fontSize: 12,
  },
  monthsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  monthItem: {
    width: '16.66%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#f8f8f8',
    position: 'relative',
  },
  monthText: {
    fontSize: 12,
    color: '#999',
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  currentSeason: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentSeasonText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  seasonalNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    padding: 8,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
});

export default SeasonalAvailability;