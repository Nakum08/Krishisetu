const expandedSalesData = [
    { 
      month: 'Jan', 
      revenue: 20000, 
      orders: 24,
      week: 1,
      weeklyRevenue: 4800,
      weeklyOrders: 6,
      quarter: 1
    },
    { 
      month: 'Jan', 
      week: 2,
      weeklyRevenue: 5200,
      weeklyOrders: 6,
      quarter: 1
    },
    { 
      month: 'Jan', 
      week: 3,
      weeklyRevenue: 4600,
      weeklyOrders: 5,
      quarter: 1
    },
    { 
      month: 'Jan', 
      week: 4,
      weeklyRevenue: 5400,
      weeklyOrders: 7,
      quarter: 1
    },
    
    // February
    { 
      month: 'Feb', 
      revenue: 45000, 
      orders: 52,
      week: 5,
      weeklyRevenue: 10500,
      weeklyOrders: 12,
      quarter: 1
    },
    { 
      month: 'Feb', 
      week: 6,
      weeklyRevenue: 11200,
      weeklyOrders: 13,
      quarter: 1
    },
    { 
      month: 'Feb', 
      week: 7,
      weeklyRevenue: 12300,
      weeklyOrders: 14,
      quarter: 1
    },
    { 
      month: 'Feb', 
      week: 8,
      weeklyRevenue: 11000,
      weeklyOrders: 13,
      quarter: 1
    },
    
    // March
    { 
      month: 'Mar', 
      revenue: 28000, 
      orders: 30,
      week: 9,
      weeklyRevenue: 6500,
      weeklyOrders: 7,
      quarter: 1
    },
    { 
      month: 'Mar', 
      week: 10,
      weeklyRevenue: 7200,
      weeklyOrders: 8,
      quarter: 1
    },
    { 
      month: 'Mar', 
      week: 11,
      weeklyRevenue: 6800,
      weeklyOrders: 7,
      quarter: 1
    },
    { 
      month: 'Mar', 
      week: 12,
      weeklyRevenue: 7500,
      weeklyOrders: 8,
      quarter: 1
    },
    
    // April
    { 
      month: 'Apr', 
      revenue: 80000, 
      orders: 88,
      week: 13,
      weeklyRevenue: 19000,
      weeklyOrders: 21,
      quarter: 2
    },
    { 
      month: 'Apr', 
      week: 14,
      weeklyRevenue: 20500,
      weeklyOrders: 22,
      quarter: 2
    },
    { 
      month: 'Apr', 
      week: 15,
      weeklyRevenue: 21000,
      weeklyOrders: 23,
      quarter: 2
    },
    { 
      month: 'Apr', 
      week: 16,
      weeklyRevenue: 19500,
      weeklyOrders: 22,
      quarter: 2
    },
    
    // May
    { 
      month: 'May', 
      revenue: 99000, 
      orders: 105,
      week: 17,
      weeklyRevenue: 24000,
      weeklyOrders: 25,
      quarter: 2
    },
    { 
      month: 'May', 
      week: 18,
      weeklyRevenue: 25500,
      weeklyOrders: 27,
      quarter: 2
    },
    { 
      month: 'May', 
      week: 19,
      weeklyRevenue: 24800,
      weeklyOrders: 26,
      quarter: 2
    },
    { 
      month: 'May', 
      week: 20,
      weeklyRevenue: 24700,
      weeklyOrders: 27,
      quarter: 2
    },
    
    // June
    { 
      month: 'Jun', 
      revenue: 43000, 
      orders: 48,
      week: 21,
      weeklyRevenue: 10200,
      weeklyOrders: 11,
      quarter: 2
    },
    { 
      month: 'Jun', 
      week: 22,
      weeklyRevenue: 11300,
      weeklyOrders: 13,
      quarter: 2
    },
    { 
      month: 'Jun', 
      week: 23,
      weeklyRevenue: 10800,
      weeklyOrders: 12,
      quarter: 2
    },
    { 
      month: 'Jun', 
      week: 24,
      weeklyRevenue: 10700,
      weeklyOrders: 12,
      quarter: 2
    },
    
    { 
      month: 'Jul', 
      revenue: 56000, 
      orders: 62,
      quarter: 3
    },
    { 
      month: 'Aug', 
      revenue: 67000, 
      orders: 71,
      quarter: 3
    },
    { 
      month: 'Sep', 
      revenue: 72000, 
      orders: 78,
      quarter: 3
    },
    
    { 
      month: 'Oct', 
      revenue: 61000, 
      orders: 65,
      quarter: 4
    },
    { 
      month: 'Nov', 
      revenue: 58000, 
      orders: 63,
      quarter: 4
    },
    { 
      month: 'Dec', 
      revenue: 105000, 
      orders: 112,
      quarter: 4
    }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 20000, orders: 24 },
    { month: 'Feb', revenue: 45000, orders: 52 },
    { month: 'Mar', revenue: 28000, orders: 30 },
    { month: 'Apr', revenue: 80000, orders: 88 },
    { month: 'May', revenue: 99000, orders: 105 },
    { month: 'Jun', revenue: 43000, orders: 48 },
    { month: 'Jul', revenue: 56000, orders: 62 },
    { month: 'Aug', revenue: 67000, orders: 71 },
    { month: 'Sep', revenue: 72000, orders: 78 },
    { month: 'Oct', revenue: 61000, orders: 65 },
    { month: 'Nov', revenue: 58000, orders: 63 },
    { month: 'Dec', revenue: 105000, orders: 112 }
  ];
  
  const weeklyData = expandedSalesData
    .filter(item => item.weeklyRevenue && item.week)
    .sort((a, b) => b.week - a.week)
    .slice(0, 6)
    .reverse()
    .map(item => ({
      label: `W${item.week}`,
      revenue: item.weeklyRevenue,
      orders: item.weeklyOrders
    }));
  
  const yearlyData = [
    { label: 'Q1', revenue: 93000, orders: 106 },  // Jan + Feb + Mar
    { label: 'Q2', revenue: 222000, orders: 241 }, // Apr + May + Jun
    { label: 'Q3', revenue: 195000, orders: 211 }, // Jul + Aug + Sep
    { label: 'Q4', revenue: 224000, orders: 240 }  // Oct + Nov + Dec
  ];
  
  export { expandedSalesData, monthlyData, weeklyData, yearlyData };