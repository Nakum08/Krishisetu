import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Keyboard,
  Animated,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const EnhancedSearchBar = ({ 
  value, 
  onChangeText, 
  onSearch, 
  placeholder = "Search...",
  products = [],
  categories = [],
  onSelectProduct,
  onSelectCategory 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      animateDropdown(0);
      return;
    }
    
    const lowerCaseQuery = value.toLowerCase();
    
    const productSuggestions = products
      .filter(product => 
        product.crop && product.crop.toLowerCase().includes(lowerCaseQuery)
      )
      .map(product => ({
        id: product.id || product.mockId,
        name: product.crop,
        type: 'product',
        data: product
      }));
    
    const categorySuggestions = categories
      .filter(category => 
        category.name && category.name.toLowerCase().includes(lowerCaseQuery)
      )
      .map(category => ({
        id: category.id,
        name: category.name,
        type: 'category',
        data: category
      }));
    
    const allSuggestions = [...productSuggestions, ...categorySuggestions];
    
    allSuggestions.sort((a, b) => {
      const aStartsWithQuery = a.name.toLowerCase().startsWith(lowerCaseQuery);
      const bStartsWithQuery = b.name.toLowerCase().startsWith(lowerCaseQuery);
      
      if (aStartsWithQuery && !bStartsWithQuery) return -1;
      if (!aStartsWithQuery && bStartsWithQuery) return 1;
      
      return a.name.localeCompare(b.name);
    });
    
    const limitedSuggestions = allSuggestions.slice(0, 8);
    setSuggestions(limitedSuggestions);
    
    const targetHeight = limitedSuggestions.length > 0 
      ? Math.min(limitedSuggestions.length * 50, 250) 
      : 0;
    animateDropdown(targetHeight);
  }, [value, products, categories]);
  
  const animateDropdown = (toValue) => {
    Animated.timing(dropdownHeight, {
      toValue,
      duration: 200,
      useNativeDriver: false
    }).start();
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  };
  
  const handleSelectSuggestion = (item) => {
    onChangeText(item.name);
    
    if (item.type === 'product') {
      onSelectProduct(item.data);
    } else if (item.type === 'category') {
      onSelectCategory(item.data);
    }
    
    setSuggestions([]);
    Keyboard.dismiss();
  };
  
  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.suggestionItem} 
      onPress={() => handleSelectSuggestion(item)}
    >
      {item.type === 'product' && item.data.images && item.data.images.length > 0 ? (
        <Image 
          source={{ uri: item.data.images[0] }} 
          style={styles.suggestionImage}
          resizeMode="cover"
        />
      ) : (
        <Ionicons 
          name={item.type === 'product' ? 'leaf-outline' : 'grid-outline'} 
          size={16} 
          color={theme.colors.primary} 
        />
      )}
      <Text style={styles.suggestionText}>{item.name}</Text>
      <Text style={styles.suggestionType}>
        {item.type === 'product' ? 'Product' : 'Category'}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <Ionicons 
          name="search-outline" 
          size={20} 
          color={isFocused ? theme.colors.primary : theme.colors.textSecondary} 
          style={styles.icon} 
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSearch(value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {value ? (
          <TouchableOpacity 
            onPress={() => {
              onChangeText('');
              setSuggestions([]);
            }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Suggestions Dropdown */}
      <Animated.View style={[styles.suggestionsContainer, { height: dropdownHeight }]}>
        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={item => `${item.type}-${item.id}`}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(16),
    paddingTop: s(12),
    paddingBottom: s(8),
    zIndex: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    borderRadius: ms(12),
    paddingHorizontal: s(16),
    height: s(50),
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(1) },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainerFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    marginRight: s(12),
  },
  input: {
    flex: 1,
    fontSize: ms(16),
    color: theme.colors.text,
    height: s(50),
  },
  clearButton: {
    padding: s(4),
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(12),
    marginTop: s(4),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: s(0), height: s(2) },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(14),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  suggestionText: {
    flex: 1,
    fontSize: ms(14),
    color: theme.colors.text,
    marginLeft: s(12),
  },
  suggestionType: {
    fontSize: ms(12),
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    borderRadius: ms(10),
  },
  suggestionImage: {
    width: s(24),
    height: s(24),
    borderRadius: ms(12),
    marginRight: s(8),
  }
});

export default EnhancedSearchBar; 