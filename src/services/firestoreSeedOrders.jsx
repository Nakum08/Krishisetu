import { getFirestore, collection, doc, setDoc,
  updateDoc,
  getDoc
 } from 'firebase/firestore';
import app from './firebase';
import { query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import { auth } from '../services/firebase';

const db = getFirestore(app);


export const createOrder = async (orderData) => {
  try {
    const orderRef = doc(collection(db, 'orders'));
    await setDoc(orderRef, orderData);
    console.log('Order created with ID:', orderRef.id);
    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};


export const seedOrders = async () => {
  const sampleOrder = {
    userId: 'user_123456',  
    products: [
      {
        productId: 'product_1234',  
        quantity: 2,
        pricePerUnit: 100,
        orderType: 'regular', 
        subtotal: 200,  
      },
      {
        productId: 'product_5678',  
        quantity: 1,
        pricePerUnit: 500,
        orderType: 'sample',
        subtotal: 500,
      },
    ],
    subtotal: 700,
    discount: 50,
    deliveryFee: 20,
    total: 670, 
    paymentMethod: 'card',  
    paymentStatus: 'completed',  
    deliveryOption: 'express',  
    shippingInfo: {
      fullName: 'John Doe',
      phoneNumber: '9876543210',
      address: '123 Main St',
      city: 'Mumbai',
      pincode: '400001',
      landmark: 'Near XYZ',
    },
    status: 'confirmed',  
    statusHistory: [
      {
        status: 'confirmed',
        timestamp: new Date(),
        note: 'Order confirmed',
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    actualDelivery: null, 
    cancelReason: '',
    notes: 'Please deliver between 10am-12pm.',
  };

  try {
    const orderId = await createOrder(sampleOrder);
    console.log('Sample order created with ID:', orderId);
  } catch (error) {
    console.error('Error seeding orders:', error);
  }
};

export const getOrderById = async (orderId) => {
  try {
    const orderDoc = await firestore.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      console.log('No order found with this ID');
      return null;
    }
    
    const data = orderDoc.data();
    return {
      id: orderDoc.id,
      ...data,
      orderDate: data.orderDate?.toDate?.() || data.orderDate,
    };
  } catch (error) {
    console.error('Error getting order details:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  // try {
  //   await firestore.collection('orders').doc(orderId).update({
  //     status: status,
  //     lastUpdated: new Date()
  //   });
  //   return true;
  // } catch (error) {
  //   console.error('Error updating order status:', error);
  //   throw error; 
  // }










  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: status,
      lastUpdated: new Date()
    });
    console.log(`Order ${orderId} updated to ${status}`);
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }


};


export const getOrdersByUser = async (userId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};


export const markOrderAsDelivered = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const timestamp = new Date();
    
    await updateDoc(orderRef, {
      status: 'delivered',
      updatedAt: timestamp,
      actualDelivery: timestamp,
      statusHistory: firebase.firestore.FieldValue.arrayUnion({
        status: 'delivered',
        timestamp,
        note: 'Order successfully delivered',
      }),
    });
    
    console.log(`Order ${orderId} marked as delivered`);
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    throw error;
  }
};


export const cancelOrder = async (orderId, reason) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const timestamp = new Date();
    
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    const orderData = orderSnap.data();
    if (orderData.status === 'delivered') {
      throw new Error('Cannot cancel an order that has already been delivered');
    }
    
    await updateDoc(orderRef, {
      status: 'cancelled',
      updatedAt: timestamp,
      cancelReason: reason,
      statusHistory: [...orderData.statusHistory, {
        status: 'cancelled',
        timestamp,
        note: `Order cancelled: ${reason}`,
      }],
    });
    
    console.log(`Order ${orderId} cancelled`);
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};


export const getAllOrders = async () => {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ ...doc.data(), docId: doc.id });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
};


export const getOrdersByFarmerName = async (farmerName) => {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    
    const orders = [];
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      if (orderData.product && 
          orderData.product.farmerName && 
          orderData.product.farmerName === farmerName) {
        orders.push({ ...orderData, docId: doc.id });
      }
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching farmer orders:', error.message);
    throw new Error(`Failed to fetch farmer orders: ${error.message}`);
  }
};

export const getOrdersByCustomerId = async (customerId) => {
  try {
    const ordersRef = firestore.collection('orders');
    const snapshot = await ordersRef.where('customerId', '==', customerId).get();
    
    if (snapshot.empty) {
      console.log('No orders found for this customer');
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        orderDate: data.orderDate?.toDate?.() || data.orderDate,
      };
    });
  } catch (error) {
    console.error('Error getting customer orders:', error);
    throw error;
  }
};

export const createSampleOrder = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    const sampleOrder = {
      customerId: customerId,
      orderDate: new Date(),
      status: 'Processing',
      totalAmount: 450,
      items: [
        {
          quantity: 2,
          product: {
            crop: 'Fresh Apples',
            images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6']
          }
        },
        {
          quantity: 1,
          product: {
            crop: 'Organic Carrots',
            images: ['https://images.unsplash.com/photo-1447175008436-054170c2e979']
          }
        }
      ],
      deliveryAddress: {
        city: 'Bangalore',
        state: 'Karnataka'
      }
    };
    
    const ordersRef = firestore.collection('orders');
    const docRef = await ordersRef.add(sampleOrder);
    console.log("Sample order created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating sample order:", error);
    throw error;
  }
};

export const createTestOrder = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const orderId = await createSampleOrder(userId);
      console.log("Created test order with ID:", orderId);
    } else {
      console.error("No user logged in");
    }
  } catch (error) {
    console.error("Error creating test order:", error);
  }
};
