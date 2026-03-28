import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const FarmStory = ({ farmStory }) => {
  const { t } = useTranslation();
  const defaultStory = "Our farm has been in the family for three generations. We use traditional farming methods combined with modern sustainable practices. Our produce is grown with care and respect for the environment, ensuring the highest quality and nutritional value.";
  
  const storyToDisplay = farmStory || defaultStory;
  
  return (
    <View style={styles.detailsContainer}>
      <View style={styles.detailsHeader}>
        <Text style={styles.detailsTitle}>{t('productDetails.farmStory')}</Text>
      </View>
      <View style={styles.farmStoryContainer}>
        <Text style={styles.farmStoryText}>
          {storyToDisplay}
        </Text>
        <TouchableOpacity style={styles.readMoreButton}>
          <Text style={styles.readMoreText}>{t('productDetails.readMore')}</Text>
          <Ionicons name="arrow-forward" size={16} color="#4CAF50" />
        </TouchableOpacity>
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
    padding: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  farmStoryContainer: {
    padding: 16,
  },
  farmStoryText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginRight: 4,
  },
});

export default FarmStory;