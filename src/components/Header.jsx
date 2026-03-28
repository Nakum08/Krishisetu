import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <TouchableOpacity 
      style={styles.backButton} 
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={24} color="#333" />
    </TouchableOpacity>
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="heart-outline" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="share-social-outline" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: s(40),
    paddingHorizontal: s(15),
    height: s(55),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor:'#f0f0f0',
    width:'100%',
  },
  backButton: {
    width: s(40),
    height: s(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: s(40),
    height: s(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
