import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform,
  PermissionsAndroid 
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme/theme';
import { Linking } from 'react-native';

const ImagePickerField = ({ images, setImages, maxImages = 5 }) => {

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
  
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return cameraPermission === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  };
  
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
  
    try {
      // For Android 13+ (API level 33+), use READ_MEDIA_IMAGES
      if (Platform.Version >= 33) {
        const mediaPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return mediaPermission === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // For older Android versions, use READ_EXTERNAL_STORAGE
        const storagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return storagePermission === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Storage permission error:', error);
      return false;
    }
  };

  
  const pickImage = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required', 
        'We need access to your photos to select product images. Please grant permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openAppSettings }
        ]
      );
      return;
    }

    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      maxWidth: 800,
      maxHeight: 800,
    };

    try {
      const result = await launchImageLibrary(options);

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required', 
        'We need access to your camera to take product photos. Please grant permission in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: openAppSettings }
        ]
      );
      return;
    }

    if (images.length >= maxImages) {
      Alert.alert('Limit Reached', `You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
      includeBase64: false,
      maxWidth: 800,
      maxHeight: 800,
    };

    try {
      const result = await launchCamera(options);

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo.');
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Images</Text>
      <Text style={styles.subtitle}>
        Upload up to {maxImages} images ({images.length}/{maxImages})
      </Text>
      
      <ScrollView horizontal style={styles.imagesContainer} showsHorizontalScrollIndicator={false}>
        {/* Selected Images */}
        {images.map((uri, index) => (
          <View key={`image-${index}`} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <Ionicons name="close-circle" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add Image Button (if not reached max) */}
        {images.length < maxImages && (
          <View style={styles.addButtonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <Ionicons name="images-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.addButton} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={24} color={theme.colors.primary} />
              <Text style={styles.addButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Helper text for image requirements */}
      <Text style={styles.helperText}>
        Images should clearly show the product. The first image will be used as the main display image.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: theme.typography.fontWeights.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  imagesContainer: {
    paddingVertical: theme.spacing.sm,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: theme.spacing.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  addButtonContainer: {
    flexDirection: 'row',
  },
  addButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight + '30', // 30% opacity
  },
  addButtonText: {
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.sm,
  },
  helperText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.sm,
  },
});

export default ImagePickerField;