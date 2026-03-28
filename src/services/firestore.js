import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

import app from './firebase';


const db = getFirestore(app);
const storage = getStorage(app, 'gs://earnpaisa-a7d55.firebasestorage.app');

export const createUserProfile = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), userData);
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    throw new Error('User profile not found');
  } catch (error) {
    throw error;
  }
};


export const fetchFarmerProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    throw new Error('Farmer profile not found');
  } catch (error) {
    throw error;
  }
};


export const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    const categoryList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return categoryList;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


const uploadImageToStorage = async (uri, imageName) => {
  try {
    console.log('Uploading image from URI:', uri);
    const response = await fetch(uri);
    const blob = await response.blob();
    console.log('Blob created:', blob);

    const storageRef = ref(storage, `products/${imageName}`);
    const metadata = { contentType: 'image/jpeg' };

    await uploadBytes(storageRef, blob, metadata);
    console.log('Image uploaded:', imageName);

    const downloadURL = await getDownloadURL(storageRef);
    console.log('Download URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const uploadImages = async (imageUris) => {
  const uploadPromises = imageUris.map((uri, index) => {
    const imageName = `product_${Date.now()}_${index}.jpg`;
    return uploadImageToStorage(uri, imageName);
  });
  return Promise.all(uploadPromises);
};

export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(), 
    }));
    return productList;
  } catch (error) {
    throw error;
  }
};


export const fetchProductsByCategory = async (categoryId) => {
  try {
    const q = query(collection(db, 'products'), where('category', '==', categoryId));
    const querySnapshot = await getDocs(q);
    const productsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productsList;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};


export const addProduct = async (productData) => {
  try {
    console.log('addProduct called with data:', productData);
    
    if (!productData.images || productData.images.length === 0) {
      throw new Error('At least one image is required.');
    }

    let imageUrls = productData.images; // Use local URIs for now
    
    // Try to upload images to Firebase Storage, but fallback to local URIs if it fails
    try {
      console.log('Attempting to upload images to Firebase Storage...');
      imageUrls = await uploadImages(productData.images);
      console.log('Images uploaded successfully:', imageUrls);
    } catch (uploadError) {
      console.warn('Image upload failed, using local URIs:', uploadError);
      // Continue with local URIs
    }

    const newProduct = {
      crop: productData.crop,
      category: productData.category.toLowerCase(),
      pricePerKg: Number(productData.pricePerKg),
      quantity: Number(productData.quantity),
      images: imageUrls,
      rating: 4.5, // Static
      farmerId: productData.farmerId, // Link to farmer
      farmerName: productData.farmerName || '',
      type: productData.type || '',
      harvestDate: productData.harvestDate || '',
      farmStory: productData.farmStory || '',
      seasonalAvailability: productData.seasonalAvailability || [],
      nutrition: {
        calories: Number(productData.nutrition?.calories) || 0,
        protein: Number(productData.nutrition?.protein) || 0,
        carbohydrates: Number(productData.nutrition?.carbohydrates) || 0,
        fiber: Number(productData.nutrition?.fiber) || 0,
        fat: Number(productData.nutrition?.fat) || 0,
      },
      isActive: true, // Product availability status
      createdAt: new Date(),
    };

    console.log('Creating product document with data:', newProduct);

    const newDocRef = doc(collection(db, 'products'));
    await setDoc(newDocRef, newProduct);

    console.log('Product added successfully with ID:', newDocRef.id);
    return newDocRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};



export const updateProduct = async (productId, productData) => {
  try {
    const updatedProduct = {
      crop: productData.crop,
      category: productData.category.toLowerCase(),
      pricePerKg: Number(productData.pricePerKg),
      quantity: Number(productData.quantity),
      images: productData.images || [],
      farmerId: productData.farmerId, // Link to farmer
      farmerName: productData.farmerName || '',
      type: productData.type || '',
      harvestDate: productData.harvestDate || '',
      farmStory: productData.farmStory || '',
      seasonalAvailability: productData.seasonalAvailability || [],
      nutrition: {
        calories: Number(productData.nutrition?.calories) || 0,
        protein: Number(productData.nutrition?.protein) || 0,
        carbohydrates: Number(productData.nutrition?.carbohydrates) || 0,
        fiber: Number(productData.nutrition?.fiber) || 0,
        fat: Number(productData.nutrition?.fat) || 0,
      },
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'products', productId), updatedProduct, { merge: true });
    console.log('Product updated successfully:', productId);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    throw error;
  }
};

// Fetch products by specific farmer
export const fetchProductsByFarmer = async (farmerId) => {
  try {
    const q = query(collection(db, 'products'), where('farmerId', '==', farmerId));
    const querySnapshot = await getDocs(q);
    const productsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productsList;
  } catch (error) {
    console.error('Error fetching products by farmer:', error);
    throw error;
  }
};

// Fetch active products (available for customers)
export const fetchActiveProducts = async () => {
  try {
    const q = query(collection(db, 'products'), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    const productsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productsList;
  } catch (error) {
    console.error('Error fetching active products:', error);
    throw error;
  }
};

// Fetch active products by category (for customer browsing)
export const fetchActiveProductsByCategory = async (categoryId) => {
  try {
    const q = query(
      collection(db, 'products'), 
      where('category', '==', categoryId),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const productsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productsList;
  } catch (error) {
    console.error('Error fetching active products by category:', error);
    throw error;
  }
};

// Get product by ID
export const getProductById = async (productId) => {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));
    if (productDoc.exists()) {
      return {
        id: productDoc.id,
        ...productDoc.data(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting product by ID:', error);
    throw error;
  }
};

// Seed sample products for testing
export const seedSampleProducts = async (farmerId) => {
  try {
    const sampleProducts = [
      {
        crop: 'Fresh Tomatoes',
        category: 'vegetables',
        pricePerKg: 40,
        quantity: 50,
        images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337'],
        farmerId: farmerId,
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Freshly harvested organic tomatoes from our family farm',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: {
          calories: 18,
          protein: 0.9,
          carbohydrates: 3.9,
          fiber: 1.2,
          fat: 0.2,
        },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Sweet Corn',
        category: 'vegetables',
        pricePerKg: 35,
        quantity: 30,
        images: ['https://images.unsplash.com/photo-1601593768797-9acb5a1e6c8c'],
        farmerId: farmerId,
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet and juicy corn grown with natural fertilizers',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: {
          calories: 86,
          protein: 3.2,
          carbohydrates: 19,
          fiber: 2.7,
          fat: 1.2,
        },
        isActive: true,
        rating: 4.3,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Apples',
        category: 'fruits',
        pricePerKg: 120,
        quantity: 25,
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'],
        farmerId: farmerId,
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Crisp and sweet apples from our orchard',
        seasonalAvailability: ['winter', 'autumn'],
        nutrition: {
          calories: 52,
          protein: 0.3,
          carbohydrates: 14,
          fiber: 2.4,
          fat: 0.2,
        },
        isActive: true,
        rating: 4.7,
        createdAt: new Date(),
      },
      {
        crop: 'Organic Wheat',
        category: 'grains',
        pricePerKg: 35,
        quantity: 100,
        images: ['https://en.pimg.jp/093/551/131/1/93551131.jpg'],
        farmerId: farmerId,
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'High-quality organic wheat from our fields',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: {
          calories: 340,
          protein: 13,
          carbohydrates: 72,
          fiber: 12,
          fat: 2.5,
        },
        isActive: true,
        rating: 4.8,
        createdAt: new Date(),
      },
      {
        crop: 'Red Chillies',
        category: 'spices',
        pricePerKg: 80,
        quantity: 20,
        images: ['https://m.media-amazon.com/images/I/51uIDsXLbWL._SX300_SY300_QL70_FMwebp_.jpg'],
        farmerId: farmerId,
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Spicy red chillies from our farm',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: {
          calories: 40,
          protein: 1.9,
          carbohydrates: 8.8,
          fiber: 1.5,
          fat: 0.4,
        },
        isActive: true,
        rating: 4.6,
        createdAt: new Date(),
      },
    ];

    for (const product of sampleProducts) {
      const newDocRef = doc(collection(db, 'products'));
      await setDoc(newDocRef, product);
      console.log('Sample product added:', product.crop);
    }

    console.log('Sample products seeded successfully');
    return sampleProducts.length;
  } catch (error) {
    console.error('Error seeding sample products:', error);
    throw error;
  }
};

// Initialize database with static data (creates collections automatically)
export const initializeDatabaseWithStaticData = async () => {
  try {
    console.log('Initializing database with static data...');
    
    // Check if products collection already has data
    const existingProducts = await fetchProducts();
    if (existingProducts.length > 0) {
      console.log('Products collection already has data, skipping initialization');
      return;
    }

    // Create static products for different farmers
    const staticFarmers = [
      { id: 'farmer_001', name: 'Organic Farmer' },
      { id: 'farmer_002', name: 'Suresh Patel' },
      { id: 'farmer_003', name: 'Ananya Gupta' },
      { id: 'farmer_004', name: 'Vikram Rao' },
      { id: 'farmer_005', name: 'Rajesh Kumar' },
    ];

    const allStaticProducts = [
      // VEGETABLES (20 products)
      {
        crop: 'Fresh Tomatoes',
        category: 'vegetables',
        pricePerKg: 40,
        quantity: 50,
        images: [
          'https://images.unsplash.com/photo-1546094096-0df4bcaaa337',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_001',
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Freshly harvested organic tomatoes from our family farm',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 18, protein: 0.9, carbohydrates: 3.9, fiber: 1.2, fat: 0.2 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Sweet Corn',
        category: 'vegetables',
        pricePerKg: 35,
        quantity: 30,
        images: [
          'https://images.unsplash.com/photo-1601593768797-9acb5a1e6c8c',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_001',
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet and juicy corn grown with natural fertilizers',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 86, protein: 3.2, carbohydrates: 19, fiber: 2.7, fat: 1.2 },
        isActive: true,
        rating: 4.3,
        createdAt: new Date(),
      },
      {
        crop: 'Organic Potatoes',
        category: 'vegetables',
        pricePerKg: 30,
        quantity: 40,
        images: [
          'https://images.unsplash.com/photo-1518977676601-b53f82aba655',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_002',
        farmerName: 'Suresh Patel',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh organic potatoes from our farm',
        seasonalAvailability: ['winter', 'autumn'],
        nutrition: { calories: 77, protein: 2, carbohydrates: 17, fiber: 2.2, fat: 0.1 },
        isActive: true,
        rating: 4.4,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Onions',
        category: 'vegetables',
        pricePerKg: 25,
        quantity: 60,
        images: [
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_002',
        farmerName: 'Suresh Patel',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh onions from our organic farm',
        seasonalAvailability: ['all'],
        nutrition: { calories: 40, protein: 1.1, carbohydrates: 9.3, fiber: 1.7, fat: 0.1 },
        isActive: true,
        rating: 4.2,
        createdAt: new Date(),
      },
      {
        crop: 'Green Peas',
        category: 'vegetables',
        pricePerKg: 45,
        quantity: 25,
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet green peas from our garden',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 84, protein: 5.4, carbohydrates: 14.5, fiber: 5.7, fat: 0.4 },
        isActive: true,
        rating: 4.6,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Carrots',
        category: 'vegetables',
        pricePerKg: 35,
        quantity: 35,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Orange carrots rich in beta-carotene',
        seasonalAvailability: ['winter', 'autumn'],
        nutrition: { calories: 41, protein: 0.9, carbohydrates: 9.6, fiber: 2.8, fat: 0.2 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Cauliflower',
        category: 'vegetables',
        pricePerKg: 30,
        quantity: 30,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_004',
        farmerName: 'Vikram Rao',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh white cauliflower heads',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 25, protein: 1.9, carbohydrates: 5, fiber: 2, fat: 0.3 },
        isActive: true,
        rating: 4.3,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Broccoli',
        category: 'vegetables',
        pricePerKg: 50,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_004',
        farmerName: 'Vikram Rao',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Nutritious green broccoli florets',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 34, protein: 2.8, carbohydrates: 7, fiber: 2.6, fat: 0.4 },
        isActive: true,
        rating: 4.7,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Spinach',
        category: 'vegetables',
        pricePerKg: 40,
        quantity: 25,
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2'
        ],
        farmerId: 'farmer_005',
        farmerName: 'Rajesh Kumar',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Iron-rich spinach leaves',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 23, protein: 2.9, carbohydrates: 3.6, fiber: 2.2, fat: 0.4 },
        isActive: true,
        rating: 4.4,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Cabbage',
        category: 'vegetables',
        pricePerKg: 25,
        quantity: 40,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7'
        ],
        farmerId: 'farmer_005',
        farmerName: 'Rajesh Kumar',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh green cabbage heads',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 25, protein: 1.3, carbohydrates: 5.8, fiber: 2.5, fat: 0.1 },
        isActive: true,
        rating: 4.2,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Bell Peppers',
        category: 'vegetables',
        pricePerKg: 60,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_001',
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Colorful bell peppers from our farm',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 31, protein: 1, carbohydrates: 7, fiber: 2.1, fat: 0.3 },
        isActive: true,
        rating: 4.6,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Cucumber',
        category: 'vegetables',
        pricePerKg: 30,
        quantity: 35,
        images: [
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_002',
        farmerName: 'Suresh Patel',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Cool and refreshing cucumbers',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 16, protein: 0.7, carbohydrates: 3.6, fiber: 0.5, fat: 0.1 },
        isActive: true,
        rating: 4.3,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Eggplant',
        category: 'vegetables',
        pricePerKg: 35,
        quantity: 25,
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Purple eggplants from our garden',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 25, protein: 1, carbohydrates: 6, fiber: 3, fat: 0.2 },
        isActive: true,
        rating: 4.4,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Okra',
        category: 'vegetables',
        pricePerKg: 40,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7'
        ],
        farmerId: 'farmer_004',
        farmerName: 'Vikram Rao',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh green okra pods',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 33, protein: 2, carbohydrates: 7, fiber: 3.2, fat: 0.2 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Ginger',
        category: 'vegetables',
        pricePerKg: 80,
        quantity: 15,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_005',
        farmerName: 'Rajesh Kumar',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh ginger with medicinal properties',
        seasonalAvailability: ['all'],
        nutrition: { calories: 80, protein: 1.8, carbohydrates: 18, fiber: 2, fat: 0.8 },
        isActive: true,
        rating: 4.7,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Garlic',
        category: 'vegetables',
        pricePerKg: 70,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_001',
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh garlic bulbs from our farm',
        seasonalAvailability: ['all'],
        nutrition: { calories: 149, protein: 6.4, carbohydrates: 33, fiber: 2.1, fat: 0.5 },
        isActive: true,
        rating: 4.6,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Mushrooms',
        category: 'vegetables',
        pricePerKg: 120,
        quantity: 10,
        images: [
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2'
        ],
        farmerId: 'farmer_002',
        farmerName: 'Suresh Patel',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh white button mushrooms',
        seasonalAvailability: ['monsoon', 'winter'],
        nutrition: { calories: 22, protein: 3.1, carbohydrates: 3.3, fiber: 1, fat: 0.3 },
        isActive: true,
        rating: 4.8,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Zucchini',
        category: 'vegetables',
        pricePerKg: 45,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh green zucchini squash',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 17, protein: 1.2, carbohydrates: 3.1, fiber: 1, fat: 0.3 },
        isActive: true,
        rating: 4.4,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Beetroot',
        category: 'vegetables',
        pricePerKg: 40,
        quantity: 25,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_004',
        farmerName: 'Vikram Rao',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Red beetroot with natural sweetness',
        seasonalAvailability: ['winter', 'autumn'],
        nutrition: { calories: 43, protein: 1.6, carbohydrates: 10, fiber: 2.8, fat: 0.2 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Radish',
        category: 'vegetables',
        pricePerKg: 25,
        quantity: 30,
        images: [
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2',
          'https://images.unsplash.com/photo-1574323347407-f5e1c87f4de7',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_005',
        farmerName: 'Rajesh Kumar',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Crisp white radishes from our farm',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 16, protein: 0.7, carbohydrates: 3.4, fiber: 1.6, fat: 0.1 },
        isActive: true,
        rating: 4.3,
        createdAt: new Date(),
      },
      // FRUITS (20 products)
      {
        crop: 'Fresh Apples',
        category: 'fruits',
        pricePerKg: 120,
        quantity: 25,
        images: [
          'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Crisp and sweet apples from our orchard',
        seasonalAvailability: ['winter', 'autumn'],
        nutrition: { calories: 52, protein: 0.3, carbohydrates: 14, fiber: 2.4, fat: 0.2 },
        isActive: true,
        rating: 4.7,
        createdAt: new Date(),
      },
      {
        crop: 'Sweet Mangoes',
        category: 'fruits',
        pricePerKg: 80,
        quantity: 35,
        images: [
          'https://images.jdmagicbox.com/quickquotes/images_main/paulmark-mango-fruit-plants-378503196-28rdm.jpeg',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_004',
        farmerName: 'Vikram Rao',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet and juicy mangoes from our farm',
        seasonalAvailability: ['summer'],
        nutrition: { calories: 60, protein: 0.8, carbohydrates: 15, fiber: 1.6, fat: 0.4 },
        isActive: true,
        rating: 4.9,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Bananas',
        category: 'fruits',
        pricePerKg: 40,
        quantity: 50,
        images: [
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b'
        ],
        farmerId: 'farmer_001',
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet yellow bananas from our plantation',
        seasonalAvailability: ['all'],
        nutrition: { calories: 89, protein: 1.1, carbohydrates: 23, fiber: 2.6, fat: 0.3 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Oranges',
        category: 'fruits',
        pricePerKg: 60,
        quantity: 30,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_002',
        farmerName: 'Suresh Patel',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Juicy oranges rich in vitamin C',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 47, protein: 0.9, carbohydrates: 12, fiber: 2.4, fat: 0.1 },
        isActive: true,
        rating: 4.6,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Grapes',
        category: 'fruits',
        pricePerKg: 100,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet purple grapes from our vineyard',
        seasonalAvailability: ['summer', 'autumn'],
        nutrition: { calories: 62, protein: 0.6, carbohydrates: 16, fiber: 0.9, fat: 0.2 },
        isActive: true,
        rating: 4.8,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Pomegranate',
        category: 'fruits',
        pricePerKg: 90,
        quantity: 15,
        images: [
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b'
        ],
        farmerId: 'farmer_004',
        farmerName: 'Vikram Rao',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Red pomegranate with juicy seeds',
        seasonalAvailability: ['winter', 'autumn'],
        nutrition: { calories: 83, protein: 1.7, carbohydrates: 19, fiber: 4, fat: 1.2 },
        isActive: true,
        rating: 4.7,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Pineapple',
        category: 'fruits',
        pricePerKg: 70,
        quantity: 25,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_005',
        farmerName: 'Rajesh Kumar',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet and tangy pineapple',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 50, protein: 0.5, carbohydrates: 13, fiber: 1.4, fat: 0.1 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Watermelon',
        category: 'fruits',
        pricePerKg: 30,
        quantity: 40,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_001',
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet and refreshing watermelon',
        seasonalAvailability: ['summer'],
        nutrition: { calories: 30, protein: 0.6, carbohydrates: 8, fiber: 0.4, fat: 0.2 },
        isActive: true,
        rating: 4.6,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Papaya',
        category: 'fruits',
        pricePerKg: 50,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b'
        ],
        farmerId: 'farmer_002',
        farmerName: 'Suresh Patel',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Ripe orange papaya from our garden',
        seasonalAvailability: ['summer', 'monsoon'],
        nutrition: { calories: 43, protein: 0.5, carbohydrates: 11, fiber: 1.7, fat: 0.3 },
        isActive: true,
        rating: 4.4,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Guava',
        category: 'fruits',
        pricePerKg: 45,
        quantity: 30,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet pink guava from our orchard',
        seasonalAvailability: ['monsoon', 'autumn'],
        nutrition: { calories: 68, protein: 2.6, carbohydrates: 14, fiber: 5.4, fat: 0.9 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Strawberries',
        category: 'fruits',
        pricePerKg: 150,
        quantity: 15,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_004',
        farmerName: 'Vikram Rao',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet red strawberries from our farm',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 32, protein: 0.7, carbohydrates: 8, fiber: 2, fat: 0.3 },
        isActive: true,
        rating: 4.9,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Kiwi',
        category: 'fruits',
        pricePerKg: 120,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b'
        ],
        farmerId: 'farmer_005',
        farmerName: 'Rajesh Kumar',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Tangy kiwi fruit rich in vitamin C',
        seasonalAvailability: ['winter', 'spring'],
        nutrition: { calories: 61, protein: 1.1, carbohydrates: 15, fiber: 3, fat: 0.5 },
        isActive: true,
        rating: 4.6,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Peach',
        category: 'fruits',
        pricePerKg: 80,
        quantity: 25,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_001',
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Juicy peaches from our orchard',
        seasonalAvailability: ['summer', 'autumn'],
        nutrition: { calories: 39, protein: 0.9, carbohydrates: 10, fiber: 1.5, fat: 0.3 },
        isActive: true,
        rating: 4.7,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Plum',
        category: 'fruits',
        pricePerKg: 70,
        quantity: 20,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_002',
        farmerName: 'Suresh Patel',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet purple plums from our garden',
        seasonalAvailability: ['summer', 'autumn'],
        nutrition: { calories: 46, protein: 0.7, carbohydrates: 11, fiber: 1.4, fat: 0.3 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Pear',
        category: 'fruits',
        pricePerKg: 90,
        quantity: 18,
        images: [
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Crisp green pears from our orchard',
        seasonalAvailability: ['autumn', 'winter'],
        nutrition: { calories: 57, protein: 0.4, carbohydrates: 15, fiber: 3.1, fat: 0.1 },
        isActive: true,
        rating: 4.4,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Apricot',
        category: 'fruits',
        pricePerKg: 100,
        quantity: 15,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_004',
        farmerName: 'Vikram Rao',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet orange apricots from our farm',
        seasonalAvailability: ['summer'],
        nutrition: { calories: 48, protein: 1.4, carbohydrates: 11, fiber: 2, fat: 0.4 },
        isActive: true,
        rating: 4.6,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Cherry',
        category: 'fruits',
        pricePerKg: 180,
        quantity: 12,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_005',
        farmerName: 'Rajesh Kumar',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Sweet red cherries from our orchard',
        seasonalAvailability: ['summer'],
        nutrition: { calories: 50, protein: 1, carbohydrates: 12, fiber: 1.6, fat: 0.3 },
        isActive: true,
        rating: 4.8,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Coconut',
        category: 'fruits',
        pricePerKg: 25,
        quantity: 40,
        images: [
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b'
        ],
        farmerId: 'farmer_001',
        farmerName: 'Organic Farmer',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh green coconuts with sweet water',
        seasonalAvailability: ['all'],
        nutrition: { calories: 354, protein: 3.3, carbohydrates: 15, fiber: 9, fat: 33 },
        isActive: true,
        rating: 4.3,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Lemon',
        category: 'fruits',
        pricePerKg: 40,
        quantity: 35,
        images: [
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea'
        ],
        farmerId: 'farmer_002',
        farmerName: 'Suresh Patel',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh yellow lemons from our garden',
        seasonalAvailability: ['all'],
        nutrition: { calories: 29, protein: 1.1, carbohydrates: 9, fiber: 2.8, fat: 0.3 },
        isActive: true,
        rating: 4.5,
        createdAt: new Date(),
      },
      {
        crop: 'Fresh Lime',
        category: 'fruits',
        pricePerKg: 35,
        quantity: 30,
        images: [
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c',
          'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea',
          'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'
        ],
        farmerId: 'farmer_003',
        farmerName: 'Ananya Gupta',
        type: 'organic',
        harvestDate: new Date().toISOString(),
        farmStory: 'Fresh green limes from our orchard',
        seasonalAvailability: ['all'],
        nutrition: { calories: 30, protein: 0.7, carbohydrates: 10, fiber: 2.8, fat: 0.2 },
        isActive: true,
        rating: 4.4,
        createdAt: new Date(),
      },
    ];

    // Add all products to database
    for (const product of allStaticProducts) {
      const newDocRef = doc(collection(db, 'products'));
      await setDoc(newDocRef, product);
      console.log('Static product added:', product.crop);
    }

    console.log(`Database initialized with ${allStaticProducts.length} products`);
    return allStaticProducts.length;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

