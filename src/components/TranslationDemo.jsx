import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { fetchProducts, fetchCategories } from '../services/firestore';
import { useTranslationUtils } from '../services/translationService';
import theme from '../theme';

const TranslationDemo = () => {
  const { t, i18n } = useTranslation();
  const { translateProducts, translateCategories, getTranslatedProductName } = useTranslationUtils();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [i18n.language]); // Reload when language changes

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from database
      const dbProducts = await fetchProducts() || [];
      const dbCategories = await fetchCategories() || [];
      
      // Translate the data
      const translatedProducts = translateProducts(dbProducts);
      const translatedCategories = translateCategories(dbCategories);
      
      setProducts(translatedProducts.slice(0, 5)); // Show first 5 products
      setCategories(translatedCategories);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Database Translation Demo</Text>
      <Text style={styles.subtitle}>Current Language: {i18n.language.toUpperCase()}</Text>
      
      {/* Language Switcher */}
      <View style={styles.languageContainer}>
        <TouchableOpacity 
          style={[styles.languageButton, i18n.language === 'en' && styles.activeButton]}
          onPress={() => changeLanguage('en')}
        >
          <Text style={[styles.languageText, i18n.language === 'en' && styles.activeText]}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.languageButton, i18n.language === 'gu' && styles.activeButton]}
          onPress={() => changeLanguage('gu')}
        >
          <Text style={[styles.languageText, i18n.language === 'gu' && styles.activeText]}>ગુજરાતી</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.languageButton, i18n.language === 'hi' && styles.activeButton]}
          onPress={() => changeLanguage('hi')}
        >
          <Text style={[styles.languageText, i18n.language === 'hi' && styles.activeText]}>हिन्दी</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories from Database:</Text>
        {categories.map((category, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>• {category.name}</Text>
          </View>
        ))}
      </View>

      {/* Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products from Database:</Text>
        {products.map((product, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>• {product.crop}</Text>
            <Text style={styles.itemSubtext}>Category: {product.category}</Text>
            {product.farmStory && (
              <Text style={styles.itemSubtext}>Story: {product.farmStory}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Translation Examples */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Translation Examples:</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>Fresh Tomatoes → {getTranslatedProductName('Fresh Tomatoes')}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Sweet Corn → {getTranslatedProductName('Sweet Corn')}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Fresh Apples → {getTranslatedProductName('Fresh Apples')}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 10,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: theme.colors.primary,
  },
  languageText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  activeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
  },
  item: {
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 5,
  },
  itemSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default TranslationDemo;
