import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, FlatList, View, TouchableOpacity, Text, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import PosterCarousel from '../components/PosterCarousel1';
import AttractiveCategoryList from '../components/AttractiveCategoryList1';
import FarmerPost from '../components/FarmerPost';
import { fetchCategories } from '../services/firestore';
import { usePosts } from '../context/PostContext';
import theme from '../theme';
import WelcomeHeader from '../components/WelcomeHeader';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { posts, loading, loadPosts, toggleLike } = usePosts(); // Use the posts context
  const [categories, setCategories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const posters = [
    'https://cdn.tractorkarvan.com/tr:f-webp/images/Blogs/top-central-government-schemes-for-farmers-in-india/pmksy.jpg',
    'https://i.pinimg.com/736x/11/2e/d2/112ed241f46e2e2ef0a3d487cda769a3.jpg',
    'https://i.pinimg.com/736x/4e/81/c0/4e81c056b5fcde0570982ff885e8452f.jpg',
    'https://i.pinimg.com/1200x/f5/ed/04/f5ed049d5bd1e461393c184733cfef08.jpg',
    'https://i.pinimg.com/736x/41/c8/56/41c856445c13d7a21a2050f99abe96cb.jpg',
    'https://i.pinimg.com/736x/4c/72/88/4c7288b891935a240935ee4152fc1ff7.jpg',
  ];
  

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  }, [loadPosts]);

  const onCategoryPress = (category) => {
    console.log('Selected Category:', category.name);
    navigation.navigate('CategoryProductsScreen', { category });
  };

  const handleLike = (postId, liked) => {
    toggleLike(postId, 'user123', liked); 
    console.log(`Post ${postId} liked: ${liked}`);
  };

  const renderPost = ({ item }) => (
    <FarmerPost 
      post={item}
      onLike={handleLike}
      onComment={(id) => console.log(`Comment on post ${id}`)}
      onShare={(id) => console.log(`Share post ${id}`)}
      onBookmark={(id) => console.log(`Bookmark post ${id}`)}
    />
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.colors.primary]}
        />
      }
    >
      <WelcomeHeader 
        userType="farmer"
        onAddProductPress={() => navigation.navigate('Products')}
        onAddPostPress={() => navigation.navigate('AddPostScreen')} 
      />
      <PosterCarousel posters={posters} />
      
      {/* Categories Section with Heading */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>{t('navigation.products')}</Text>
          <View style={styles.sectionHeaderDivider} />
          <Text style={styles.sectionSubHeaderText}>{t('dashboard.welcome')}</Text>
        </View>
        <AttractiveCategoryList categories={categories} onCategoryPress={onCategoryPress} />
      </View>
      
      {/* Posts Section with Heading */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <Text style={styles.sectionHeaderText}>{t('navigation.community')}</Text>
          <View style={styles.sectionHeaderDivider} />
          <Text style={styles.sectionSubHeaderText}>{t('dashboard.welcome')}</Text>
        </View>
        
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('common.loading')}</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={renderPost}
            contentContainerStyle={styles.postListContainer}
            scrollEnabled={false} // Let outer ScrollView handle scrolling
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('search.noResults')}</Text>
              </View>
            }
          />
        )}
      </View>
      
      {/* <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View> */}
      
      {/* <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={[styles.addButton, styles.addPostButton]} 
          onPress={() => navigation.navigate('AddPostScreen')}
        >
          <Text style={styles.addButtonText}>Create Post</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  sectionContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionHeaderContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionHeaderText: {
    fontSize: ms(24),
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  sectionHeaderDivider: {
    width: s(60),
    height: s(3),
    backgroundColor: theme.colors.accent || '#4CAF50',
    marginVertical: theme.spacing.xs,
    borderRadius: ms(1.5),
  },
  sectionSubHeaderText: {
    fontSize: ms(14),
    fontStyle: 'italic',
    color: theme.colors.textSecondary || '#666',
    marginTop: theme.spacing.xs,
  },
  postListContainer: {
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    padding: s(20),
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.textSecondary,
    fontSize: ms(16),
  },
  emptyContainer: {
    padding: s(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: ms(16),
    textAlign: 'center',
  },
  addButtonContainer: {
    marginVertical: theme.spacing.md,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '80%',
    alignItems: 'center',
  },
  addPostButton: {
    backgroundColor: theme.colors.secondary || '#FF9800',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: ms(16),
  },
});

export default FarmerDashboard;