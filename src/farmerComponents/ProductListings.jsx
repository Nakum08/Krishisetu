import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProductsByFarmer } from '../services/firestore';
import { useTranslation } from 'react-i18next';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const ProductListings = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Get current farmer ID from AsyncStorage
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('ProductListings - Farmer ID from AsyncStorage:', userToken);
        
        if (!userToken) {
          console.error('Farmer not logged in');
          return;
        }
        
        // Fetch only products belonging to this farmer
        const productList = await fetchProductsByFarmer(userToken);
        console.log('Products loaded for farmer:', productList.length, 'items');
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    };

    loadProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('farmer.productListings')}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.crop}>{item.crop}</Text>
              <Text style={styles.text}>{t('farmer.quantity')}: {item.quantity}</Text>
              <Text style={styles.text}>{t('farmer.price')}: {item.pricePerKg}</Text>
              <Text style={styles.nutritionInfo}>{item.nutritionInfo}</Text>
              <Text style={styles.lastUpdated}>{t('farmer.lastUpdated')}: {item.lastUpdated}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: s(20),
    backgroundColor: '#fff',
    borderRadius: ms(10),
    padding: s(15),
    shadowColor: '#000',
    shadowOffset: {
      width: s(0),
      height: s(2),
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: ms(20),
    fontWeight: 'bold',
    marginBottom: s(15),
    color: '#333',
  },
  item: {
    padding: s(10),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(10),
  },
  productImage: {
    width: s(100),
    height: s(100),
    borderRadius: ms(10),
    marginRight: s(15),
  },
  productDetails: {
    flex: 1,
  },
  crop: {
    fontSize: ms(18),
    fontWeight: 'bold',
    marginBottom: s(5),
    color: '#333',
  },
  text: {
    fontSize: ms(14),
    color: '#444',
    marginBottom: s(3),
  },
  nutritionInfo: {
    fontSize: ms(13),
    fontStyle: 'italic',
    color: '#666',
    marginBottom: s(5),
  },
  lastUpdated: {
    fontSize: ms(12),
    color: '#888',
  },
});

export default ProductListings;