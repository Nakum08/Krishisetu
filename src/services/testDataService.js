import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

/**
 * Add test orders and products for a farmer
 */
export const addTestData = async (farmerId) => {
  try {
    console.log('Adding test data for farmer:', farmerId);
    
    // Sample customer IDs
    const customers = [
      { id: 'test_customer_001', name: 'Alice Johnson' },
      { id: 'test_customer_002', name: 'Bob Smith' },
      { id: 'test_customer_003', name: 'Charlie Brown' },
      { id: 'test_customer_004', name: 'Diana Prince' },
      { id: 'test_customer_005', name: 'Eve Williams' },
    ];
    
    // Sample products
    const sampleProducts = [
      { name: 'Fresh Tomatoes', price: 40, category: 'vegetables' },
      { name: 'Sweet Corn', price: 35, category: 'vegetables' },
      { name: 'Fresh Apples', price: 120, category: 'fruits' },
      { name: 'Organic Wheat', price: 35, category: 'grains' },
      { name: 'Fresh Carrots', price: 30, category: 'vegetables' },
    ];
    
    // Get current date
    const now = new Date();
    
    // Create test orders across different months
    const testOrders = [];
    
    // Generate 15-20 orders over the last 6 months
    for (let i = 0; i < 18; i++) {
      const monthsAgo = Math.floor(Math.random() * 6); // 0-5 months ago
      const orderDate = new Date(now);
      orderDate.setMonth(orderDate.getMonth() - monthsAgo);
      orderDate.setDate(Math.floor(Math.random() * 28) + 1); // Random day 1-28
      
      const customer = customers[Math.floor(Math.random() * customers.length)];
      
      // Random 1-3 products per order
      const numProducts = Math.floor(Math.random() * 3) + 1;
      const orderProducts = [];
      let orderTotal = 0;
      
      for (let j = 0; j < numProducts; j++) {
        const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const quantity = Math.floor(Math.random() * 10) + 1; // 1-10 kg
        const subtotal = product.price * quantity;
        
        orderProducts.push({
          productName: product.name,
          crop: product.name,
          quantity: quantity,
          pricePerUnit: product.price,
          subtotal: subtotal,
        });
        
        orderTotal += subtotal;
      }
      
      // Random status
      const statuses = ['delivered', 'shipped', 'processing', 'confirmed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      testOrders.push({
        farmerId: farmerId,
        customerId: customer.id,
        customerName: customer.name,
        total: orderTotal,
        createdAt: Timestamp.fromDate(orderDate),
        orderDate: Timestamp.fromDate(orderDate),
        status: status,
        products: orderProducts,
        shippingInfo: {
          fullName: customer.name,
          address: '123 Test Street',
          city: 'Mumbai',
          pincode: '400001',
        },
        isTestData: true, // Mark as test data for easy cleanup
      });
    }
    
    // Add orders to Firestore
    const orderPromises = testOrders.map(order => 
      addDoc(collection(db, 'orders'), order)
    );
    await Promise.all(orderPromises);
    
    // Add test products if they don't exist
    const productsToAdd = sampleProducts.map(product => ({
      farmerId: farmerId,
      crop: product.name,
      category: product.category,
      pricePerKg: product.price,
      quantity: Math.floor(Math.random() * 100) + 50, // 50-150 kg stock
      isActive: true,
      rating: 4.0 + Math.random(), // 4.0-5.0 rating
      images: ['https://via.placeholder.com/300'],
      type: 'organic',
      harvestDate: new Date().toISOString(),
      farmStory: 'Test product from our organic farm',
      seasonalAvailability: ['all'],
      nutrition: {
        calories: 50,
        protein: 2,
        carbohydrates: 10,
        fiber: 3,
        fat: 0.5,
      },
      createdAt: new Date(),
      isTestData: true, // Mark as test data
    }));
    
    const productPromises = productsToAdd.map(product => 
      addDoc(collection(db, 'products'), product)
    );
    await Promise.all(productPromises);
    
    console.log(`✅ Added ${testOrders.length} test orders and ${productsToAdd.length} test products`);
    
    return {
      ordersAdded: testOrders.length,
      productsAdded: productsToAdd.length,
    };
  } catch (error) {
    console.error('Error adding test data:', error);
    throw error;
  }
};

/**
 * Remove all test data for a farmer
 */
export const removeTestData = async (farmerId) => {
  try {
    console.log('Removing test data for farmer:', farmerId);
    
    // Remove test orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('farmerId', '==', farmerId),
      where('isTestData', '==', true)
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    const orderDeletePromises = ordersSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(orderDeletePromises);
    
    // Remove test products
    const productsQuery = query(
      collection(db, 'products'),
      where('farmerId', '==', farmerId),
      where('isTestData', '==', true)
    );
    const productsSnapshot = await getDocs(productsQuery);
    const productDeletePromises = productsSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(productDeletePromises);
    
    console.log(`✅ Removed ${ordersSnapshot.size} test orders and ${productsSnapshot.size} test products`);
    
    return {
      ordersRemoved: ordersSnapshot.size,
      productsRemoved: productsSnapshot.size,
    };
  } catch (error) {
    console.error('Error removing test data:', error);
    throw error;
  }
};

/**
 * Check if test data exists for a farmer
 */
export const hasTestData = async (farmerId) => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('farmerId', '==', farmerId),
      where('isTestData', '==', true)
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    return ordersSnapshot.size > 0;
  } catch (error) {
    console.error('Error checking test data:', error);
    return false;
  }
};

