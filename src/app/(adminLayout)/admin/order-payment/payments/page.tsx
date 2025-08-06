"use client";

import { useState } from "react";
import { motion, easeOut } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAllPaymentQuery,
  useUpdatePaymentMutation,
} from "@/redux/api/payment/paymentApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { IPayment, PaymentStatus } from "@/types/order/order";
import { PaginationControls } from "@/components/common/PaginationControls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CopyButton } from "@/components/common/CopyButton";
import { CreditCard, Search, AlertTriangle, CheckCircle, Clock, XCircle, RefreshCw, DollarSign, Users, TrendingUp } from 'lucide-react';

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data, isLoading, isError } = useGetAllPaymentQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm,
  });

  const [updatePayment, { isLoading: updateLoading }] =
    useUpdatePaymentMutation();

  const handleStatusChange = async (
    paymentId: string,
    status: PaymentStatus
  ) => {
    setUpdatingId(paymentId);
    try {
      await updatePayment({ id: paymentId, data: { status } }).unwrap();
      toast.success("Payment status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingId(null);
    }
  };

  const payments = data?.data || [];
  const meta = data?.meta;
  const totalPages = Math.ceil(meta?.total / meta?.limit) || 1;

  // Calculate stats
  const totalPayments = meta?.total || 0;
  const completedPayments = payments.filter((p: IPayment) => p.status === 'COMPLETED').length;
  const pendingPayments = payments.filter((p: IPayment) => p.status === 'PENDING').length;
  const totalAmount = payments.reduce((sum: number, payment: IPayment) => sum + (payment.order.total || 0), 0);

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

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4" />;
      case 'REFUND':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'REFUND':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return <PaymentsSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load payments</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-full bg-primary/10">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Payment Management
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Monitor and manage all payment transactions with real-time status updates
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-50 dark:bg-blue-950/20 border-0">
              <CardContent className="py-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Payments
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {totalPayments.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-green-50 dark:bg-green-950/20 border-0">
              <CardContent className="py-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Completed
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {completedPayments.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-yellow-50 dark:bg-yellow-950/20 border-0">
              <CardContent className="py-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {pendingPayments.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                {pendingPayments > 0 && (
                  <div className="absolute top-2 right-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-purple-50 dark:bg-purple-950/20 border-0">
              <CardContent className="py-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      ${totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Search and Controls */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardContent className="py-0 p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="py-0 p-0">
              {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="p-4 rounded-full bg-muted/20 mb-4">
                    <CreditCard className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No payments found</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {searchTerm
                      ? "No payments match your search criteria. Try adjusting your search terms."
                      : "No payments have been processed yet. Payments will appear here once customers make purchases."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="font-semibold">Payment ID</TableHead>
                        <TableHead className="font-semibold">Order ID</TableHead>
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Method</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Paid At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment: IPayment, index: number) => (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {payment.id.slice(0, 8)}...
                              </Badge>
                              <CopyButton text={payment.id} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {payment.orderId.slice(0, 8)}...
                              </Badge>
                              <CopyButton text={payment.orderId} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {payment.order.user.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{payment.order.user.name}</p>
                                <p className="text-xs text-muted-foreground">{payment.order.user.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={payment.status}
                              onValueChange={(value) =>
                                handleStatusChange(payment.id, value as PaymentStatus)
                              }
                              disabled={updateLoading && updatingId === payment.id}
                            >
                              <SelectTrigger className="w-32">
                                <div className="flex items-center space-x-2">
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Pending</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Completed</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="FAILED">
                                  <div className="flex items-center space-x-2">
                                    <XCircle className="h-4 w-4" />
                                    <span>Failed</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="REFUND">
                                  <div className="flex items-center space-x-2">
                                    <RefreshCw className="h-4 w-4" />
                                    <span>Refund</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {payment.method}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              ${(payment.order.total || 0).toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {payment.paidAt
                                ? new Date(payment.paidAt).toLocaleDateString()
                                : "N/A"}
                            </span>
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
        {payments.length > 0 && (
          <motion.div variants={itemVariants}>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              totalItems={meta?.total || 0}
              itemsPerPage={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const PaymentsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
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
          <CardContent className="py-0 p-0">
            <div className="space-y-4 p-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsPage;
