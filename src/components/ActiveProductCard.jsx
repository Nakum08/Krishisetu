import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../theme';
import { useTranslationUtils } from '../services/translationService';

const ThumbnailList = ({ images, activeImage, onThumbnailPress }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailContainer}>
      {images.map((img, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => onThumbnailPress(img)}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: img }}
            style={[
              styles.thumbnail,
              activeImage === img && styles.activeThumbnail,
            ]}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const NutritionInfoModal = ({ visible, onClose, nutrition, product }) => {
  const { t } = useTranslation();
  const { getTranslatedProductName, getTranslatedFarmStory, getTranslatedFarmerName } = useTranslationUtils();
  
  if (!product) return null;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{getTranslatedProductName(product.crop)}</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScrollContent}>
            {product.images && product.images.length > 0 && (
              <Image source={{ uri: product.images[0] }} style={styles.modalImage} />
            )}
            
            <View style={styles.infoSection}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>{t('productDetails.basicInformation')}</Text>
              </View>
              
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('productDetails.product')}</Text>
                  <Text style={styles.infoValue}>{getTranslatedProductName(product.crop)}</Text>
                </View>
                <View style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('productDetails.category')}</Text>
                  <View style={styles.chipContainer}>
                    <View style={[styles.chip, {backgroundColor: theme.colors.primary}]}>
                      <Text style={styles.chipText}>{product.category}</Text>
                    </View>
                    {product.type && (
                      <View style={[styles.chip, {backgroundColor: '#2E7D32'}]}>
                        <Text style={styles.chipText}>{product.type}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('productDetails.price')}</Text>
                  <Text style={styles.infoPriceValue}>₹{product.pricePerKg}<Text style={styles.infoUnitText}>/kg</Text></Text>
                </View>
                <View style={styles.divider} />
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('productDetails.stock')}</Text>
                  <Text style={styles.infoValue}>{product.quantity} kg {t('productDetails.available')}</Text>
                </View>
              </View>
            </View>

            {product.nutrition && (
              <View style={styles.infoSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="nutrition" size={20} color={theme.colors.primary} />
                  <Text style={styles.sectionTitle}>{t('productDetails.nutritionalValues')}</Text>
                </View>
                <Text style={styles.nutritionSubtitle}>{t('productDetails.per100gServing')}</Text>
                
                <View style={styles.infoCard}>
                  <View style={styles.nutritionRow}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{product.nutrition.calories || 0}</Text>
                      <Text style={styles.nutritionLabel}>{t('productDetails.calories')}</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{product.nutrition.protein || 0}g</Text>
                      <Text style={styles.nutritionLabel}>{t('productDetails.protein')}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.nutritionRow}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{product.nutrition.carbohydrates || 0}g</Text>
                      <Text style={styles.nutritionLabel}>{t('productDetails.carbs')}</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{product.nutrition.fat || 0}g</Text>
                      <Text style={styles.nutritionLabel}>{t('productDetails.fat')}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.nutritionRow}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionValue}>{product.nutrition.fiber || 0}g</Text>
                      <Text style={styles.nutritionLabel}>{t('productDetails.fiber')}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {product.farmStory && (
              <View style={styles.infoSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="leaf" size={20} color={theme.colors.primary} />
                  <Text style={styles.sectionTitle}>{t('productDetails.farmStory')}</Text>
                </View>
                <View style={styles.infoCard}>
                  <Text style={styles.storyText}>{getTranslatedFarmStory(product.farmStory)}</Text>
                </View>
              </View>
            )}

            {product.seasonalAvailability && product.seasonalAvailability.length > 0 && (
              <View style={styles.infoSection}>
                <View style={styles.sectionHeaderRow}>
                  <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                  <Text style={styles.sectionTitle}>{t('productDetails.seasonalAvailability')}</Text>
                </View>
                <View style={styles.infoCard}>
                  <View style={styles.availabilityContainer}>
                    {product.seasonalAvailability.map((month) => (
                      <View key={month} style={styles.monthChip}>
                        <Text style={styles.monthText}>{month}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const ActiveProductCard = ({
  product,
  viewType = 'farmer', 
  onEdit,
  onDelete,
  onFavorite,
  onAddToCart,
}) => {
  const { t } = useTranslation();
  const { getTranslatedProductName, getTranslatedFarmStory, getTranslatedFarmerName } = useTranslationUtils();
  const [activeImage, setActiveImage] = useState(
    product.images && product.images.length > 0 ? product.images[0] : null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleThumbnailPress = (img) => {
    setActiveImage(img);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
          {product.type && (
            <View style={[styles.categoryBadge, styles.typeBadge]}>
              <Text style={styles.categoryText}>{product.type}</Text>
            </View>
          )}
        </View>
        
        {viewType === 'farmer' ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onEdit && onEdit(product)}
            >
              <Ionicons name="pencil" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => onDelete && onDelete(product.id)}
            >
              <Ionicons name="trash" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={() => onFavorite && onFavorite(product.id)}
          >
            <Ionicons name="heart" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
        
      <View style={styles.imageContainer}>
        {activeImage ? (
          <Image source={{ uri: activeImage }} style={styles.bigImage} resizeMode="cover" />
        ) : (
          <View style={[styles.bigImage, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={60} color="#ddd" />
          </View>
        )}
      </View>
      
      {product.images && product.images.length > 1 && (
        <View style={styles.thumbnailWrapper}>
          <ThumbnailList
            images={product.images}
            activeImage={activeImage}
            onThumbnailPress={handleThumbnailPress}
          />
        </View>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productName}>{getTranslatedProductName(product.crop)}</Text>
          <Text style={styles.farmerName}>by {getTranslatedFarmerName(product.farmerName || 'Unknown Farmer')}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.priceContainer}>
            <View style={styles.priceIconContainer}>
              <Ionicons name="cash-outline" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.priceLabel}>{t('productDetails.price')}</Text>
              <Text style={styles.productPrice}>₹{product.pricePerKg}<Text style={styles.perKg}>/kg</Text></Text>
            </View>
          </View>
          
          <View style={styles.quantityContainer}>
            <View style={styles.quantityIconContainer}>
              <Ionicons name="cube-outline" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.quantityLabel}>{t('productDetails.available')}</Text>
              <Text style={styles.productQuantity}>{product.quantity} kg</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.infoButton} 
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="information-circle-outline" size={18} color="#fff" />
            <Text style={styles.buttonText}>{t('buttons.viewDetails')}</Text>
          </TouchableOpacity>
          
          {viewType === 'customer' && (
            <TouchableOpacity 
              style={styles.addToCartButton} 
              onPress={() => onAddToCart && onAddToCart(product.id)}
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.buttonText}>{t('productDetails.addToCart')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <NutritionInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        nutrition={product.nutrition}
        product={product}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    zIndex: 10,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  typeBadge: {
    backgroundColor: '#2E7D32',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,214,214,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  bigImage: {
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailWrapper: {
    backgroundColor: '#f0f0f0',
    paddingVertical: theme.spacing.sm,
  },
  thumbnailContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  thumbnail: {
    width: 52,
    height: 52,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  activeThumbnail: {
    borderColor: theme.colors.primary,
    transform: [{ scale: 1.05 }],
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  productInfoContainer: {
    marginBottom: theme.spacing.md,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  farmerName: {
    fontSize: 14,
    color: '#FF3B5C',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  priceLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  perKg: {
    fontWeight: 'normal',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quantityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  quantityLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  productQuantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoButton: {
    flexDirection: 'row',
    backgroundColor:'#FF3B5C',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    width: '90%',
    maxHeight: '85%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  modalScrollContent: {
    padding: theme.spacing.md,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  infoSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.xs,
  },
  nutritionSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    marginLeft: 24,
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  infoPriceValue: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  infoUnitText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 6,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  nutritionLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  storyText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textPrimary,
  },
  availabilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  monthChip: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  monthText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ActiveProductCard;