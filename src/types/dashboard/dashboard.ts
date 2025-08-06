export interface IDashboardAnalytics {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    pendingOrders: number;
    outOfStock: number;
    newCustomers: number;
    unansweredQuestions: number;

    salesOverTime: {
      _sum: { total: number };
      createdAt: string; // ISO date string
    }[];

    orderStatusDistribution: {
      _count: { status: number };
      status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | string;
    }[];

    topSellingProducts: {
      _sum: { quantity: number };
      productId: string;
      product: {
        id: string;
        name: string;
      };
    }[];

    topCategoriesBySales: {
      totalSales:  number 
      categoryId: string;
      category: {
        id: string;
        name: string;
        slug: string
      };
    }[];

    userRegistrationTrend: {
      _count: { createdAt: number };
      createdAt: string;
    }[];

    paymentMethodDistribution: {
      _count: { method: number };
      method: string | null;
    }[];
}
