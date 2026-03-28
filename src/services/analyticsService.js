import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import app from './firebase';

const db = getFirestore(app);

/**
 * Get summary metrics for a farmer
 * Returns total revenue, orders, products, and unique customers
 */
export const getFarmerSummaryMetrics = async (farmerId) => {
  try {
    // Fetch all orders for this farmer
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, where('farmerId', '==', farmerId));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    let totalRevenue = 0;
    let totalOrders = ordersSnapshot.size;
    const uniqueCustomers = new Set();
    
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      if (order.total) {
        totalRevenue += order.total;
      }
      if (order.customerId) {
        uniqueCustomers.add(order.customerId);
      }
    });
    
    // Fetch all active products for this farmer
    const productsRef = collection(db, 'products');
    const productsQuery = query(
      productsRef, 
      where('farmerId', '==', farmerId),
      where('isActive', '==', true)
    );
    const productsSnapshot = await getDocs(productsQuery);
    const totalProducts = productsSnapshot.size;
    
    return {
      revenue: {
        value: `₹${totalRevenue.toLocaleString('en-IN')}`,
        rawValue: totalRevenue,
        change: '+0%', // We'll calculate this later if we add historical data
        timeFrame: 'All Time',
      },
      orders: {
        value: totalOrders.toString(),
        rawValue: totalOrders,
        change: '+0%',
        timeFrame: 'All Time',
      },
      products: {
        value: totalProducts.toString(),
        rawValue: totalProducts,
        change: '0%',
        timeFrame: 'Current',
      },
      customers: {
        value: uniqueCustomers.size.toString(),
        rawValue: uniqueCustomers.size,
        change: '+0%',
        timeFrame: 'All Time',
      },
    };
  } catch (error) {
    console.error('Error fetching farmer summary metrics:', error);
    throw error;
  }
};

/**
 * Get sales data grouped by month
 */
export const getFarmerMonthlySales = async (farmerId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, where('farmerId', '==', farmerId));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    // Initialize data structure for all months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthNames.map(month => ({
      month,
      revenue: 0,
      orders: 0,
    }));
    
    // Aggregate orders by month
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      let orderDate;
      
      // Handle different date formats
      if (order.createdAt?.toDate) {
        orderDate = order.createdAt.toDate();
      } else if (order.createdAt) {
        orderDate = new Date(order.createdAt);
      } else if (order.orderDate?.toDate) {
        orderDate = order.orderDate.toDate();
      } else if (order.orderDate) {
        orderDate = new Date(order.orderDate);
      } else {
        return; // Skip if no valid date
      }
      
      const monthIndex = orderDate.getMonth();
      if (monthlyData[monthIndex]) {
        monthlyData[monthIndex].revenue += order.total || 0;
        monthlyData[monthIndex].orders += 1;
      }
    });
    
    return monthlyData;
  } catch (error) {
    console.error('Error fetching monthly sales:', error);
    throw error;
  }
};

/**
 * Get revenue breakdown by product
 */
export const getFarmerRevenueBreakdown = async (farmerId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, where('farmerId', '==', farmerId));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    const productRevenue = {};
    let totalRevenue = 0;
    
    // Aggregate revenue by product
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      
      if (order.products && Array.isArray(order.products)) {
        // Handle orders with multiple products
        order.products.forEach(item => {
          const productName = item.productName || item.crop || 'Unknown Product';
          const itemTotal = item.subtotal || (item.pricePerUnit * item.quantity) || 0;
          
          if (!productRevenue[productName]) {
            productRevenue[productName] = 0;
          }
          productRevenue[productName] += itemTotal;
          totalRevenue += itemTotal;
        });
      } else if (order.product) {
        // Handle single product orders
        const productName = order.product.crop || order.product.name || 'Unknown Product';
        const itemTotal = order.total || 0;
        
        if (!productRevenue[productName]) {
          productRevenue[productName] = 0;
        }
        productRevenue[productName] += itemTotal;
        totalRevenue += itemTotal;
      }
    });
    
    // Convert to array and sort by revenue
    const revenueArray = Object.entries(productRevenue)
      .map(([name, revenue]) => ({
        name,
        revenue: Math.round(revenue),
        percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
    
    // Assign colors
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];
    
    // Take top 5 and group rest as "Other"
    let breakdown = revenueArray.slice(0, 5).map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
    }));
    
    if (revenueArray.length > 5) {
      const otherRevenue = revenueArray.slice(5).reduce((sum, item) => sum + item.revenue, 0);
      const otherPercentage = totalRevenue > 0 ? Math.round((otherRevenue / totalRevenue) * 100) : 0;
      breakdown.push({
        name: 'Other Products',
        revenue: otherRevenue,
        percentage: otherPercentage,
        color: '#9E9E9E',
      });
    }
    
    return breakdown;
  } catch (error) {
    console.error('Error fetching revenue breakdown:', error);
    throw error;
  }
};

/**
 * Get top selling products
 */
export const getFarmerTopProducts = async (farmerId) => {
  try {
    const ordersRef = collection(db, 'orders');
    const ordersQuery = query(ordersRef, where('farmerId', '==', farmerId));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    const productStats = {};
    
    // Aggregate sales by product
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      
      if (order.products && Array.isArray(order.products)) {
        order.products.forEach(item => {
          const productName = item.productName || item.crop || 'Unknown Product';
          const quantity = item.quantity || 0;
          const revenue = item.subtotal || (item.pricePerUnit * item.quantity) || 0;
          
          if (!productStats[productName]) {
            productStats[productName] = { sold: 0, revenue: 0 };
          }
          productStats[productName].sold += quantity;
          productStats[productName].revenue += revenue;
        });
      } else if (order.product) {
        const productName = order.product.crop || order.product.name || 'Unknown Product';
        const quantity = order.quantity || 1;
        const revenue = order.total || 0;
        
        if (!productStats[productName]) {
          productStats[productName] = { sold: 0, revenue: 0 };
        }
        productStats[productName].sold += quantity;
        productStats[productName].revenue += revenue;
      }
    });
    
    // Convert to array and sort by quantity sold
    const topProducts = Object.entries(productStats)
      .map(([name, stats]) => ({
        name,
        sold: stats.sold,
        revenue: Math.round(stats.revenue),
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
    
    return topProducts;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

/**
 * Get inventory status for farmer's products
 */
export const getFarmerInventoryStatus = async (farmerId) => {
  try {
    const productsRef = collection(db, 'products');
    const productsQuery = query(productsRef, where('farmerId', '==', farmerId));
    const productsSnapshot = await getDocs(productsQuery);
    
    const inventory = [];
    
    productsSnapshot.forEach((doc) => {
      const product = doc.data();
      const stock = product.quantity || 0;
      
      let status = 'out_of_stock';
      if (stock > 50) {
        status = 'in_stock';
      } else if (stock > 0) {
        status = 'low_stock';
      }
      
      inventory.push({
        id: doc.id,
        name: product.crop || 'Unknown Product',
        stock: stock,
        unit: 'kg',
        status: status,
        isActive: product.isActive || false,
      });
    });
    
    // Sort by stock level (lowest first to highlight issues)
    inventory.sort((a, b) => a.stock - b.stock);
    
    return inventory;
  } catch (error) {
    console.error('Error fetching inventory status:', error);
    throw error;
  }
};

/**
 * Get recent orders for a farmer
 */
export const getFarmerRecentOrders = async (farmerId, limitCount = 10) => {
  try {
    const ordersRef = collection(db, 'orders');
    // Only filter by farmerId, sort in JavaScript to avoid needing an index
    const ordersQuery = query(ordersRef, where('farmerId', '==', farmerId));
    const ordersSnapshot = await getDocs(ordersQuery);
    
    const recentOrders = [];
    
    ordersSnapshot.forEach((doc) => {
      const order = doc.data();
      
      let orderDate = 'N/A';
      let orderTimestamp = 0;
      
      if (order.createdAt?.toDate) {
        const date = order.createdAt.toDate();
        orderDate = date.toISOString().split('T')[0];
        orderTimestamp = date.getTime();
      } else if (order.createdAt) {
        const date = new Date(order.createdAt);
        orderDate = date.toISOString().split('T')[0];
        orderTimestamp = date.getTime();
      } else if (order.orderDate?.toDate) {
        const date = order.orderDate.toDate();
        orderDate = date.toISOString().split('T')[0];
        orderTimestamp = date.getTime();
      } else if (order.orderDate) {
        const date = new Date(order.orderDate);
        orderDate = date.toISOString().split('T')[0];
        orderTimestamp = date.getTime();
      }
      
      // Extract product name and quantity
      let productName = 'Unknown Product';
      let quantity = 0;
      
      if (order.products && Array.isArray(order.products) && order.products.length > 0) {
        productName = order.products[0].productName || order.products[0].crop || 'Multiple Products';
        quantity = order.products.reduce((sum, item) => sum + (item.quantity || 0), 0);
      } else if (order.product) {
        productName = order.product.crop || order.product.name || 'Unknown Product';
        quantity = order.quantity || 1;
      }
      
      recentOrders.push({
        id: doc.id,
        customer: order.customerName || order.shippingInfo?.fullName || 'Unknown Customer',
        date: orderDate,
        product: productName,
        quantity: quantity,
        total: order.total || 0,
        status: order.status || 'pending',
        timestamp: orderTimestamp, // For sorting
      });
    });
    
    // Sort by timestamp in JavaScript (most recent first) and limit
    return recentOrders
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limitCount)
      .map(order => {
        // Remove timestamp from final result
        const { timestamp, ...orderWithoutTimestamp } = order;
        return orderWithoutTimestamp;
      });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

/**
 * Get all analytics data for a farmer in one call
 */
export const getFarmerAnalytics = async (farmerId) => {
  try {
    const [
      summaryMetrics,
      monthlySales,
      revenueBreakdown,
      topProducts,
      recentOrders,
    ] = await Promise.all([
      getFarmerSummaryMetrics(farmerId),
      getFarmerMonthlySales(farmerId),
      getFarmerRevenueBreakdown(farmerId),
      getFarmerTopProducts(farmerId),
      getFarmerRecentOrders(farmerId),
    ]);
    
    return {
      summaryMetrics,
      salesData: monthlySales,
      revenueBreakdown,
      topProducts,
      recentOrders,
    };
  } catch (error) {
    console.error('Error fetching farmer analytics:', error);
    throw error;
  }
};
