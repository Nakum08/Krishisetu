import React, { useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme';

const InitialsAvatar = ({ userAvatar, size = 45 }) => {
  if (userAvatar && typeof userAvatar === 'object' && userAvatar.initials) {
    return (
      <View 
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: userAvatar.backgroundColor || '#1abc9c',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 2,
          borderColor: theme.colors.primary,
        }}
      >
        <Text style={{ color: 'white', fontSize: size * 0.4, fontWeight: 'bold' }}>
          {userAvatar.initials}
        </Text>
      </View>
    );
  }
  
  if (typeof userAvatar === 'string') {
    return (
      <Image 
        source={{ uri: userAvatar }} 
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: theme.colors.primary,
        }} 
      />
    );
  }
  
  return (
    <View 
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.primary,
      }}
    >
      <Text style={{ color: 'white', fontSize: size * 0.4, fontWeight: 'bold' }}>?</Text>
    </View>
  );
};

const FarmerPost = ({ post, onLike }) => {
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const heartAnim = useRef(new Animated.Value(1)).current;
  
  const lastTapRef = useRef(null);
  
  const screenWidth = Dimensions.get('window').width;

  const handleLike = () => {
    Animated.sequence([
      Animated.timing(heartAnim, {
        toValue: 1.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heartAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
    
    setLiked((prev) => !prev);
    onLike && onLike(post.id, !liked);
  };
  
  const handleImagePress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (lastTapRef.current && (now - lastTapRef.current) < DOUBLE_TAP_DELAY) {
      handleLike();
      lastTapRef.current = null;
    } else {
      lastTapRef.current = now;
    }
  };
  
  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.postContainer}>
      {/* Post Header with gradient overlay */}
      <View style={styles.header}>
        <InitialsAvatar userAvatar={post.userAvatar} size={45} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.username}</Text>
          <Text style={styles.timestamp}>{typeof post.timestamp === 'string' ? post.timestamp : 'Just now'}</Text>
        </View>
      </View>
      
      {/* Image Carousel */}
      {post.images && post.images.length > 0 ? (
        <View>
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
          >
            {post.images.map((image, index) => (
              <TouchableOpacity 
                key={index}
                activeOpacity={0.9}
                onPress={handleImagePress}
                style={{ width: screenWidth }}
              >
                <Image 
                  source={{ uri: image }} 
                  style={styles.postImage} 
                  resizeMode="cover" 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Image indicator circles */}
          {post.images.length > 1 && (
            <View style={styles.indicatorContainer}>
              {post.images.map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.indicator, 
                    index === currentImageIndex && styles.indicatorActive
                  ]} 
                />
              ))}
            </View>
          )}
        </View>
      ) : null}
      
      {/* Like button and counter in a creative way */}
      <View style={styles.likeContainer}>
        <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={32}
              color={liked ? '#FF3B5C' : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.likesText}>
          {liked ? (post.likes || 0) + 1 : (post.likes || 0)} likes
        </Text>
      </View>
      
      {/* Post Caption */}
      {post.caption || post.description ? (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText}>
            <Text style={styles.captionUsername}>{post.username} </Text>
            {post.caption || post.description}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  userInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  postImage: {
    width: '100%',
    height: 350,
    backgroundColor: '#f0f0f0',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 3,
  },
  indicatorActive: {
    backgroundColor: '#ffffff',
    width: 12,
    height: 8,
    borderRadius: 4,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  likeButton: {
    padding: theme.spacing.xs,
    borderRadius: 20,
    backgroundColor: 'rgba(8, 1, 1, 0.14)',
  },
  likesText: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
  },
  captionContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  captionText: {
    color: theme.colors.textPrimary,
    fontSize: 15,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default FarmerPost;