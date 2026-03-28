import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image, 
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createPost } from '../services/firestoreSeedPosts';
import theme from '../theme';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import UnifiedHeader from '../components/UnifiedHeader';
import { usePosts } from '../context/PostContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const generateInitialsAvatar = (name) => {
  if (!name || typeof name !== 'string') return null;
  
  const nameParts = name.trim().split(' ');
  let initials = '';
  
  if (nameParts.length >= 2) {
    initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
  } else if (nameParts.length === 1 && nameParts[0].length > 0) {
    initials = nameParts[0][0];
  }
  
  initials = initials.toUpperCase();
  
  const gradients = [
    ['#FF9966', '#FF5E62'], // Sunset
    ['#4776E6', '#8E54E9'], // Royal Blue
    ['#00B09B', '#96C93D'], // Green Fields
    ['#FDC830', '#F37335'], // Citrus Peel
    ['#5614B0', '#DBD65C'], // Violet Dreams
    ['#ED4264', '#FFEDBC'], // Rose Water
    ['#2F80ED', '#56CCF2'], // Blue Skies
    ['#11998e', '#38ef7d'], // Spring Green
    ['#F953C6', '#B91D73'], // Pink Love
    ['#8A2387', '#F27121'], // Vibrant Sunset
  ];
  
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
  
  return {
    initials,
    gradient: gradients[colorIndex]
  };
};

const AddPostScreen = ({ navigation, route }) => {
  const { addPost } = usePosts();
  const { t } = useTranslation(); 
  const [farmerName, setFarmerName] = useState('');
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const user = route.params?.user || {
    id: 'user123',
  };

  const selectImages = async () => {
    if (images.length >= 5) {
      Alert.alert(t('addPost.maximumReached'), t('addPost.maxImagesMessage'));
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.9,
      selectionLimit: 5 - images.length,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) return;
      
      if (result.errorCode) {
        Alert.alert(t('common.error'), result.errorMessage);
        return;
      }
      
      if (result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert(t('common.error'), t('addPost.failedToSelectImages'));
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      Alert.alert(t('addPost.missingImage'), t('addPost.selectImageMessage'));
      return;
    }

    if (!caption.trim()) {
      Alert.alert(t('addPost.missingDescription'), t('addPost.addDescriptionMessage'));
      return;
    }

    if (!farmerName.trim()) {
      Alert.alert(t('addPost.missingFarmerName'), t('addPost.enterFarmerNameMessage'));
      return;
    }

    try {
      setLoading(true);
      
      const avatar = generateInitialsAvatar(farmerName);
      
      const postData = {
        userId: user.id,
        username: farmerName.trim(),
        userAvatar: avatar,
        description: caption.trim(),
        images: images,
        likes: 0,
      };
      
      // Create post in Firebase and get the full post object including ID
      const newPost = await createPost(postData);
      
      // Add the new post to the context state so it appears in the dashboard immediately
      addPost(newPost);
      
      Alert.alert(t('common.success'), t('addPost.postPublished'));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create post:', error);
      Alert.alert(t('common.error'), t('addPost.failedToCreatePost'));
    } finally {
      setLoading(false);
    }
  };

  const avatarPreview = farmerName ? generateInitialsAvatar(farmerName) : null;
  const isFormComplete = caption.trim() && images.length > 0 && farmerName.trim() && !loading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <UnifiedHeader
        title={t('addPost.createPost')}
        onBackPress={() => navigation.goBack()}
        onCartPress={() => navigation.navigate('CustomerCartScreen')}
        showMenuButton={false}
      />      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{t('addPost.createPost')}</Text>
        
        <TouchableOpacity 
          style={[styles.shareButton, !isFormComplete && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={!isFormComplete}
        >
          <LinearGradient
            colors={isFormComplete ? ['#11998e', '#38ef7d'] : ['#e0e0e0', '#c0c0c0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradientButton}
          >
            <Text style={styles.shareButtonText}>{t('addPost.share')}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced Farmer Section with Gradient Avatar */}
        <View style={styles.farmerSection}>
          {avatarPreview ? (
            <LinearGradient
              colors={avatarPreview.gradient}
              style={styles.avatarPreview}
            >
              <Text style={styles.avatarText}>{avatarPreview.initials}</Text>
            </LinearGradient>
          ) : (
            <View style={styles.placeholderAvatar}>
              <Ionicons name="person" size={24} color="#ccc" />
            </View>
          )}
          
          <View style={styles.farmerNameContainer}>
            <Text style={styles.farmerLabel}>{t('addPost.farmerName')}</Text>
            <TextInput
              style={styles.farmerName}
              placeholder={t('addPost.enterFarmerName')}
              placeholderTextColor={theme.colors.textSecondary}
              value={farmerName}
              onChangeText={setFarmerName}
            />
          </View>
        </View>

        {/* Enhanced Image Uploader */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="images-outline" size={18} color={theme.colors.primary} /> 
            {' '}{t('addPost.photos')}
          </Text>
          
          {images.length > 0 ? (
            <View style={styles.selectedImagesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri }} style={styles.previewImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {images.length < 5 && (
                  <TouchableOpacity
                    style={styles.addMoreImagesButton} 
                    onPress={selectImages}
                  >
                    <Ionicons name="add-outline" size={40} color={theme.colors.primary} />
                    <Text style={styles.addMoreText}>{t('addPost.addMore')}</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
              
              <Text style={styles.imageCount}>
                {images.length}/5 {t('addPost.photosSelected')}
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadContainer} onPress={selectImages}>
              <View style={styles.uploadIconContainer}>
                <Ionicons name="cloud-upload-outline" size={50} color={theme.colors.primary} />
              </View>
              <Text style={styles.uploadText}>{t('addPost.tapToAddPhotos')}</Text>
              <Text style={styles.uploadSubtext}>({t('addPost.maximumImages')})</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Enhanced Caption Section */}
        <View style={styles.captionSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="create-outline" size={18} color={theme.colors.primary} /> 
            {' '}{t('addPost.description')}
          </Text>
          
          <View style={styles.captionContainer}>
            <TextInput
              style={styles.caption}
              placeholder={t('addPost.shareDetails')}
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              value={caption}
              onChangeText={setCaption}
              textAlignVertical="top"
            />
          </View>
          
          <Text style={styles.captionHelper}>
            {t('addPost.descriptionHelper')}
          </Text>
        </View>
        
        {/* Post Preview */}
        {isFormComplete && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>{t('addPost.postPreview')}</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewHeader}>
                {avatarPreview && (
                  <LinearGradient
                    colors={avatarPreview.gradient}
                    style={styles.previewAvatar}
                  >
                    <Text style={styles.avatarText}>{avatarPreview.initials}</Text>
                  </LinearGradient>
                )}
                <Text style={styles.previewName}>{farmerName}</Text>
              </View>
              
              {images.length > 0 && (
                <Image source={{ uri: images[0] }} style={styles.previewMainImage} />
              )}
              
              <Text style={styles.previewCaption} numberOfLines={2}>
                {caption}
              </Text>
            </View>
          </View>
        )}
        
        {/* Spacer for better scrolling experience */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Loading Overlay with Blur Effect */}
      {/* {loading && (
        <View style={styles.loadingOverlay}>
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={5}
          />
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Publishing your post...</Text>
          </View>
        </View>
      )} */}

{loading && (
  <View style={styles.loadingOverlay}>
    <View style={styles.blurBackground} />
    <View style={styles.loadingCard}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>{t('addPost.publishingPost')}</Text>
    </View>
  </View>
)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  blurBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  shareButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  farmerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 12,
    marginTop: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeholderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  avatarText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  farmerNameContainer: {
    flex: 1,
  },
  farmerLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  farmerName: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
    marginLeft: 4,
  },
  imageSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedImagesContainer: {
    marginBottom: 8,
  },
  uploadContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 150, 136, 0.1)',
    borderRadius: 40,
    marginBottom: 16,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  previewImage: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 12,
    margin: 4,
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  addMoreImagesButton: {
    width: width * 0.25,
    height: width * 0.35,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 150, 136, 0.1)',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    margin: 4,
  },
  addMoreText: {
    color: theme.colors.primary,
    marginTop: 4,
    fontWeight: '500',
  },
  imageCount: {
    marginTop: 8,
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
  },
  captionSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  captionContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
  },
  caption: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    minHeight: 100,
    lineHeight: 22,
  },
  captionHelper: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  previewSection: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
    marginLeft: 4,
  },
  previewCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  previewMainImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  previewCaption: {
    padding: 12,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 60,
  },
});

export default AddPostScreen;