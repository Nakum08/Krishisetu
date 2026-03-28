import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, FlatList, Button, Text, View, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import PosterCarousel from '../components/PosterCarousel1';
import AttractiveCategoryList from '../components/AttractiveCategoryList1';
import FarmerPost from '../components/FarmerPost';
import { fetchCategories } from '../services/firestore'; 
import { fetchAllPosts, togglePostLike } from '../services/firestoreSeedPosts'; 
import { useNavigation } from '@react-navigation/native';
import theme from '../theme';
import WelcomeHeader from '../components/WelcomeHeader';
import { s, ms, wp, hp, vs } from '../utils/responsive';

const CustomerDashboard = () => {
  const { t } = useTranslation();
  const posters = [
    'https://i.pinimg.com/736x/37/f4/09/37f4092cc5ff1a012d044f53c4d658bd.jpg',
    'https://i.pinimg.com/736x/a7/84/9e/a7849ebeb595713d234c64296a2900b3.jpg',
    'https://i.pinimg.com/736x/5e/fc/40/5efc40a7e8f61ecfff3d3319c180cf4b.jpg',
    'https://www.asiafarming.com/wp-content/uploads/2023/11/Different-Types-of-Agriculture-Subsidy-In-India5-768x513.jpg',
    'https://i.pinimg.com/736x/f9/cb/d2/f9cbd2dfa17c00ba293b78b17cbe40bd.jpg',
    'https://i.pinimg.com/736x/e2/66/56/e266561409af0aea5f5db681e63e3933.jpg',
  ];

  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

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

  const convertTimestampToString = (timestamp) => {
    if (!timestamp) return new Date().toISOString();
    
    if (typeof timestamp === 'string') return timestamp;
    
    if (typeof timestamp.toDate === 'function') return timestamp.toDate().toISOString();
    
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toISOString();
    
    if (timestamp instanceof Date) return timestamp.toISOString();
    
    return new Date().toISOString();
  };

  const formatPost = (post) => {
    const formattedPost = { ...post };
    
    formattedPost.createdAt = convertTimestampToString(post.createdAt);
    
    if (post.timestamp) {
      formattedPost.timestamp = convertTimestampToString(post.timestamp);
    }
    
    if (post.updatedAt) {
      formattedPost.updatedAt = convertTimestampToString(post.updatedAt);
    }
    
    return formattedPost;
  };

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postsData = await fetchAllPosts(20);
        console.log('Raw posts data:', JSON.stringify(postsData));
        
        const formattedPosts = postsData.map(post => {
          try {
            return formatPost(post);
          } catch (err) {
            console.error(`Error formatting post ${post.id}:`, err);
            return {
              ...post,
              createdAt: new Date().toISOString(),
              timestamp: new Date().toISOString(),
              ...Object.entries(post).reduce((acc, [key, value]) => {
                acc[key] = typeof value === 'object' && value !== null && !Array.isArray(value) 
                  ? JSON.stringify(value) 
                  : value;
                return acc;
              }, {})
            };
          }
        });
        
        console.log('Formatted posts:', JSON.stringify(formattedPosts));
        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(`Failed to load posts: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const onCategoryPress = (category) => {
    console.log('Selected Category:', category.name);
    navigation.navigate('CategoryProductsScreen', { category });
  };

  const handlePostLike = async (postId, liked) => {
    try {
      const userId = 'current-user-id'; 
      await togglePostLike(postId, userId, liked);
      
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const likedBy = post.likedBy || [];
          return {
            ...post,
            likes: liked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1),
            likedBy: liked 
              ? [...likedBy, userId]
              : likedBy.filter(id => id !== userId)
          };
        }
        return post;
      }));
      
      console.log(`Post ${postId} ${liked ? 'liked' : 'unliked'}`);
    } catch (error) {
      console.error('Error toggling post like:', error);
    }
  };

  const renderPost = ({ item }) => (
    <FarmerPost 
      post={item}
      onLike={(id, liked) => handlePostLike(id, liked)}
      onComment={(id) => navigation.navigate('CommentsScreen', { postId: id })}
      onShare={(id) => console.log(`Share post ${id}`)}
      onBookmark={(id) => console.log(`Bookmark post ${id}`)}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <WelcomeHeader 
        userType="customer"
        onWishlistPress={() => navigation.navigate('CustomerCartScreen')}
        onCartPress={() => navigation.navigate('CustomerCartScreen')} 
      />
      <PosterCarousel posters={posters} />
      
      <View style={styles.sectionHeadingWrapper}>
        <View style={styles.sectionHeadingContainer}>
          <View style={styles.headingLine} />
          <Text style={styles.sectionHeading}>{t('categories.all').toUpperCase()}</Text>
          <View style={styles.headingLine} />
        </View>
        <Text style={styles.sectionSubheading}>{t('dashboard.welcome')}</Text>
      </View>
      <AttractiveCategoryList categories={categories} onCategoryPress={onCategoryPress} />
      
      <View style={styles.sectionHeadingWrapper}>
        <View style={styles.sectionHeadingContainer}>
          <View style={styles.headingLine} />
          <Text style={styles.sectionHeading}>{t('navigation.community').toUpperCase()}</Text>
          <View style={styles.headingLine} />
        </View>
        <Text style={styles.sectionSubheading}>{t('dashboard.welcome')}</Text>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>{t('common.loading')}</Text>
        </View>
      ) : (
        posts.length > 0 ? (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id || String(Math.random())}
            renderItem={renderPost}
            contentContainerStyle={styles.postListContainer}
            scrollEnabled={false} 
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text>{t('search.noResults')}</Text>
          </View>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  postListContainer: {
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  errorContainer: {
    padding: theme.spacing.md,
    backgroundColor: '#ffeeee',
    margin: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
  },
  errorText: {
    color: '#d32f2f',
  },
  emptyContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  sectionHeadingWrapper: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  sectionHeadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: s(8),
  },
  headingLine: {
    height: s(1),
    flex: 1,
    backgroundColor: theme.colors.primary || '#2E7D32',
    opacity: 0.6,
  },
  sectionHeading: {
    fontSize: ms(16),
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.primary || '#2E7D32',
    paddingHorizontal: s(15),
    textTransform: 'uppercase',
  },
  sectionSubheading: {
    fontSize: ms(14),
    color: theme.colors.text || '#5A5A5A',
    textAlign: 'center',
    fontStyle: 'normal',
    letterSpacing: 0.3,
    marginTop: s(2),
  },
});

export default CustomerDashboard;