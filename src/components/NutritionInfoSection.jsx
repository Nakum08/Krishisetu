import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NutritionInfoSection = ({ nutritionInfo }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View style={styles.detailsContainer}>
      <TouchableOpacity 
        style={styles.detailsHeader}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.detailsTitle}>Nutrition Information</Text>
        <Ionicons 
          name={expanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#666"
        />
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.nutritionContainer}>
          {Object.entries(nutritionInfo).map(([key, value]) => (
            key !== 'vitamins' && (
              <View key={key} style={styles.nutritionRow}>
                <Text style={styles.nutritionLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Text>
                <Text style={styles.nutritionValue}>{value}</Text>
              </View>
            )
          ))}
          {nutritionInfo.vitamins && nutritionInfo.vitamins.length > 0 && (
            <>
              <Text style={styles.vitaminsTitle}>Vitamins & Minerals:</Text>
              <View style={styles.vitaminsContainer}>
                {nutritionInfo.vitamins.map((vitamin, index) => (
                  <View key={`vitamin-${index}`} style={styles.vitaminTag}>
                    <Text style={styles.vitaminText}>{vitamin}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
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
  nutritionContainer: {
    paddingTop: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  vitaminsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  vitaminsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  vitaminTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  vitaminText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  nutritionNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
});

export default NutritionInfoSection;
