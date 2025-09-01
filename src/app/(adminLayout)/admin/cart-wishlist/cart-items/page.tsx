"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGetCartQuery } from "@/redux/api/cart/cartApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { ICart } from "@/types/cart/cart";
import { PaginationControls } from "@/components/common/PaginationControls";
import { CopyButton } from "@/components/common/CopyButton";
import { ShoppingCart, Search, Users, Package, AlertTriangle, ShoppingBag } from 'lucide-react';

const CartItemsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data, isLoading, isError } = useGetCartQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm,
  });

  const carts = data?.data || [];
  const meta = data?.meta;
  const totalPages = Math.ceil(meta?.total / meta?.limit) || 1;

  // Calculate stats
  const totalCarts = meta?.total || 0;
  const totalItems = carts.reduce((sum: number, cart: ICart) => sum + cart.items.length, 0);
  const averageItemsPerCart = totalCarts > 0 ? (totalItems / totalCarts).toFixed(1) : "0";

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

  if (isLoading) {
    return <CartItemsSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load cart items</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
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
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Cart Items Management
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Monitor and manage customer shopping carts and their contents
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="py-0 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Carts
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {totalCarts?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-green-50 dark:bg-green-950/20">
            <CardContent className="py-0 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Items
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {totalItems?.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20">
                  <Package className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-purple-50 dark:bg-purple-950/20">
            <CardContent className="py-0 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg Items/Cart
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {averageItemsPerCart}
                  </p>
                </div>
                <div className="p-3 rounded-full text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Controls */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg py-0">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user name or email..."
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
          <Card className="shadow-lg">
            <CardHeader className="border-b py-0">
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span>Cart Items ({totalCarts})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 p-0">
              {carts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No cart items found</h3>
                  <p className="text-muted-foreground max-w-md">
                    No cart items match your search criteria. Try adjusting your search terms.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cart ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Total Items</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {carts.map((cart: ICart, index: number) => (
                        <motion.tr
                          key={cart.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {cart.id.slice(0, 8)}...
                              </Badge>
                              <CopyButton text={cart.id} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {cart.user.name
                                    ?.split(" ")
                                    .map((n: string) => n[0])
                                    .join("")
                                    .toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{cart.user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">{cart.user.email}</span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={cart.items.length > 5 ? "default" : "secondary"}
                              className="font-semibold"
                            >
                              {cart.items.length} items
                            </Badge>
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
        {carts.length > 0 && (
          <motion.div variants={itemVariants}>
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              itemsPerPage={limit}
              onLimitChange={setLimit}
              totalItems={meta?.total || 0}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const CartItemsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="space-y-6">
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
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="py-0 p-0">
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartItemsPage;
