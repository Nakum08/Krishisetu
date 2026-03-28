import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const SearchBar = ({ value, onChangeText, onSearch, placeholder }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder || t('search.placeholder')}
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={() => onSearch(value)}
          returnKeyType="search"
        />
        {value ? (
          <TouchableOpacity 
            onPress={() => onChangeText('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(16),
    paddingVertical: s(8),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    height: s(44),
  },
  icon: {
    marginRight: s(8),
  },
  input: {
    flex: 1,
    fontSize: ms(16),
    color: theme.colors.text,
    height: s(44),
  },
  clearButton: {
    padding: s(4),
  },
});

export default SearchBar;