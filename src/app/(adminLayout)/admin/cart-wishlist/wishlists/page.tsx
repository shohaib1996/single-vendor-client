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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWishlistQuery } from "@/redux/api/wishlist/wishlistApi";
import { useDebounced } from "@/redux/hooks/hooks";
import { IWishlistItem } from "@/types/wishlist/wishlist";
import { PaginationControls } from "@/components/common/PaginationControls";
import { CopyButton } from "@/components/common/CopyButton";
import { Heart, Search, Package, DollarSign, AlertTriangle } from 'lucide-react';

const WishlistsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 500,
  });

  const { data, isLoading, isError } = useGetWishlistQuery({
    page,
    limit,
    searchTerm: debouncedSearchTerm,
  });

  const wishlists = data?.data || [];
  const meta = data?.meta;
  const totalPages = Math.ceil(meta?.total / meta?.limit) || 1;

  // Calculate stats
  const totalWishlists = meta?.total || 0;
  const totalValue = wishlists.reduce(
    (sum: number, item: IWishlistItem) => sum + item.product.price,
    0
  );
  const averagePrice = totalWishlists > 0 ? totalValue / totalWishlists : 0;

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
    return <WishlistSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Failed to load wishlists
            </h3>
            <p className="text-muted-foreground">
              Please try refreshing the page
            </p>
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
            <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-900/20">
              <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 bg-clip-text text-transparent">
              Wishlists Management
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Monitor customer wishlists and product preferences
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group"
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-pink-50 dark:bg-pink-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Wishlists
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {totalWishlists?.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/20 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group"
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Value
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      ${totalValue?.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-full text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group"
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Average Price
                    </p>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      ${averagePrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg py-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              {wishlists.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="p-4 rounded-full bg-muted/20 mb-4">
                    <Heart className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No wishlists found
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    No wishlist items match your search criteria. Try adjusting
                    your search terms.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b">
                        <TableHead className="font-semibold">
                          Wishlist ID
                        </TableHead>
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Product</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wishlists.map(
                        (wishlist: IWishlistItem, index: number) => (
                          <motion.tr
                            key={wishlist.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group hover:bg-muted/50 transition-colors duration-200"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs"
                                >
                                  {wishlist.id.slice(0, 8)}...
                                </Badge>
                                <CopyButton text={wishlist.id} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {wishlist.user.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">
                                    {wishlist.user.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {wishlist.user.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                <p className="font-medium text-sm truncate">
                                  {wishlist.product.name}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="font-semibold"
                              >
                                ${wishlist.product.price.toFixed(2)}
                              </Badge>
                            </TableCell>
                          </motion.tr>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {wishlists.length > 0 && (
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
const WishlistSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
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
          <CardContent className="p-6">
            <Skeleton className="h-10 w-full max-w-md" />
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WishlistsPage;
