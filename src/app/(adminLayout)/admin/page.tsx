"use client";

import React from "react";
import { easeOut, motion } from "framer-motion";
import { useGetDashboardAnalyticsQuery } from "@/redux/api/dashboard/dashboardAnalyticsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  UserPlus,
  HelpCircle,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie,
} from "recharts";
import { format, parseISO } from "date-fns";
import { IDashboardAnalytics } from "@/types";

const AdminDashboard = () => {
  const { data, isLoading, error } = useGetDashboardAnalyticsQuery({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
      },
    },
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  const analytics: IDashboardAnalytics = data?.data;

  if (!analytics) {
    return null;
  }

  // KPI Cards Data
  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      trend: "+12.5%",
    },
    {
      title: "Total Orders",
      value: analytics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      trend: "+8.2%",
    },
    {
      title: "Total Customers",
      value: analytics.totalCustomers.toLocaleString(),
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      trend: "+15.3%",
    },
    {
      title: "Total Products",
      value: analytics.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      trend: "+5.7%",
    },
    {
      title: "Pending Orders",
      value: analytics.pendingOrders.toLocaleString(),
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      urgent: analytics.pendingOrders > 10,
    },
    {
      title: "Out of Stock",
      value: analytics.outOfStock.toLocaleString(),
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      urgent: analytics.outOfStock > 5,
    },
    {
      title: "New Customers",
      value: analytics.newCustomers.toLocaleString(),
      icon: UserPlus,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      subtitle: "Last 30 days",
    },
    {
      title: "Unanswered Questions",
      value: analytics.unansweredQuestions.toLocaleString(),
      icon: HelpCircle,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
      urgent: analytics.unansweredQuestions > 0,
    },
  ];

  // Chart colors
  const chartColors = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
  ];

  // Process sales over time data
  const salesData = analytics.salesOverTime.map((item) => ({
    date: format(parseISO(item.createdAt), "MMM dd"),
    sales: item._sum.total || 0,
  }));

  // Process order status distribution
  const orderStatusData = analytics.orderStatusDistribution.map(
    (item, index) => ({
      name: item.status,
      value: item._count.status,
      color: chartColors[index % chartColors.length],
    })
  );

  // Process top selling products
  const topProductsData = analytics.topSellingProducts
    .slice(0, 10)
    .map((item) => ({
      name:
        item.product.name.length > 20
          ? `${item.product.name.substring(0, 20)}...`
          : item.product.name,
      quantity: item._sum.quantity || 0,
    }));

  // Process user registration trend
  const registrationData = analytics.userRegistrationTrend.map((item) => ({
    date: format(parseISO(item.createdAt), "MMM dd"),
    registrations: item._count.createdAt,
  }));

  // Process payment method distribution
  const paymentMethodData = analytics.paymentMethodDistribution.map(
    (item, index) => ({
      name: item.method || "Unknown",
      value: item._count.method,
      color: chartColors[index % chartColors.length],
    })
  );

  // Process top categories by sales data
  const topCategoriesData = analytics.topCategoriesBySales.reduce(
    (acc: { [key: string]: { name: string; sales: number } }, item) => {
      const categoryName = item.category?.name || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = { name: categoryName, sales: 0 };
      }
      acc[categoryName].sales += item?.totalSales || 0;
      return acc;
    },
    {}
  );

  const topCategoriesChartData = Object.values(topCategoriesData)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 8)
    .map((item) => ({
      name:
        item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name,
      sales: item.sales,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-2 md:p-6 lg:p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-left space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor your business performance with real-time analytics and
            insights
          </p>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <Card
                className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${kpi.bgColor}`}
              >
                <CardContent className="">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        {kpi.title} {kpi.subtitle && <span className="text-xs text-muted-foreground">{`(${kpi.subtitle})`}</span>}
                      </p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-2xl md:text-3xl font-bold text-foreground">
                          {kpi.value}
                        </p>
                        {kpi.trend && (
                          <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {kpi.trend}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded-full ${kpi.color} ${kpi.bgColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <kpi.icon className="h-6 w-6" />
                    </div>
                  </div>
                  {kpi.urgent && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Sales Over Time */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Sales Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient
                        id="salesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Sales",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Status Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span>Order Status Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Selling Products */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Top Selling Products</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topProductsData}
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      type="number"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => value.toLocaleString()}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      className="text-xs"
                      tick={{ fontSize: 10, fill: "hsl(var(--foreground))" }}
                      width={110}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))",
                      }}
                      formatter={(value, name) => [
                        value.toLocaleString(),
                        "Quantity Sold",
                      ]}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="quantity"
                      fill="#10b981"
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    ></Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Registration Trend */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>User Registration Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={registrationData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [value, "New Registrations"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="registrations"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
          {/* top category sale */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Top Categories by Sales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topCategoriesChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [
                        `$${value.toLocaleString()}`,
                        "Total Sales",
                      ]}
                    />
                    <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
          {/* Payment Method Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center space-x-2 justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Payment Method Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent ?? 0 * 100).toFixed(0)}%`
                      }
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="text-left space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardHeader className="border-b">
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="">
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
