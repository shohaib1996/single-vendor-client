"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "@/redux/api/order/orderApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { IOrder, OrderStatus } from "@/types/order/order";
import { PaginationControls } from "@/components/common/PaginationControls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Eye, ShoppingCart, Search, Trash2, AlertTriangle, DollarSign, Clock, CheckCircle, Package, Loader2 } from 'lucide-react';
import Link from "next/link";
import { CopyButton } from "@/components/common/CopyButton";

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updateLoadingStates, setUpdateLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const [deleteOrder, { isLoading: deleteLoading }] = useDeleteOrderMutation();

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data, isLoading, isError } = useGetAllOrdersQuery({
    page,
    limit: itemsPerPage,
    searchTerm: debouncedSearchTerm,
  });

  const [updateOrder] = useUpdateOrderMutation();

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdateLoadingStates((prev) => ({ ...prev, [orderId]: true }));
    try {
      await updateOrder({ id: orderId, data: { status } }).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    } finally {
      setUpdateLoadingStates((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleDelete = async (orderId: string) => {
    setDeletingId(orderId);
    try {
      await deleteOrder(orderId).unwrap();
      toast.success("Order deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete order");
    } finally {
      setDeletingId(null);
    }
  };

  const orders = data?.data || [];
  const meta = data?.meta;
  const totalPages = Math.ceil(meta?.total / meta?.limit) || 1;

  // Animation variants
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
      },
    },
  };

  

  // Get payment status badge
  const getPaymentStatusBadge = (status: string) => {
    const isSuccess = status.toLowerCase().includes('success') || status.toLowerCase().includes('paid');
    const isPending = status.toLowerCase().includes('pending');
    
    return (
      <Badge variant={isSuccess ? "default" : isPending ? "secondary" : "destructive"}>
        {status}
      </Badge>
    );
  };

  // Stats calculation
  const totalOrders = meta?.total || 0;
  const pendingOrders = orders.filter((order: IOrder) => order.status === 'PENDING').length;
  const totalRevenue = orders.reduce((sum: number, order: IOrder) => sum + order.total, 0);

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load orders</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className=" space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Monitor and manage all customer orders with real-time status updates
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-0">
            <CardContent className="py-0 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {totalOrders.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <ShoppingCart className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-0">
            <CardContent className="py-0 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {pendingOrders.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
              {pendingOrders > 0 && (
                <div className="absolute top-2 right-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-0">
            <CardContent className="py-0 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Controls */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg py-0">
            <CardContent className=" p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user ID or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardHeader className="border-b py-0">
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span>All Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 p-0">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "Orders will appear here once customers start placing them"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order: IOrder, index: number) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {order.id.slice(0, 8)}...
                              </Badge>
                              <CopyButton text={order.id} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary">
                                  {order.user.email.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium">{order.user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="font-semibold">{order.total.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleStatusChange(order.id, value as OrderStatus)
                              }
                              disabled={updateLoadingStates[order.id] || false}
                            >
                              <SelectTrigger className="w-[140px]">
                                {updateLoadingStates[order.id] ? (
                                  <div className="flex items-center space-x-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Updating...</span>
                                  </div>
                                ) : (
                                  <SelectValue />
                                )}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-yellow-600" />
                                    <span>Pending</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="SHIPPED">
                                  <div className="flex items-center space-x-2">
                                    <Package className="h-4 w-4 text-blue-600" />
                                    <span>Shipped</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="DELIVERED">
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Delivered</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="PAID">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="h-4 w-4 text-emerald-600" />
                                    <span>Paid</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="CANCELED">
                                  <div className="flex items-center space-x-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <span>Canceled</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {getPaymentStatusBadge(order.payment.status)}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end space-x-2">
                              <Link href={`/admin/order-payment/orders/${order.id}`}>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={deleteLoading && deletingId === order.id}
                                  >
                                    {deleteLoading && deletingId === order.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <div className="flex items-center space-x-2">
                                      <AlertTriangle className="h-5 w-5 text-destructive" />
                                      <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                    </div>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this order? This action cannot be undone and will permanently remove the order data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(order.id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Delete Order
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {orders.length > 0 && (
          <motion.div variants={itemVariants}>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              itemsPerPage={itemsPerPage}
              onLimitChange={setItemsPerPage}
              totalItems={meta?.total || 0}
              limitOptions={[5, 10, 15, 20, 30]}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const OrdersSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="py-0 p-6">
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

        {/* Search Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="py-0 p-6">
            <Skeleton className="h-10 w-full max-w-md" />
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="shadow-lg">
          <CardHeader className="border-b py-0">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="py-0 p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrdersPage;
