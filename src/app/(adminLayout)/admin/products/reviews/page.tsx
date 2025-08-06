"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "@/redux/api/review/reviewApi";
import { IReview } from "@/types/product/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PaginationControls } from "@/components/common/PaginationControls";
import { useAppSelector } from "@/redux/hooks/hooks";
import {
  Eye,
  Edit,
  Trash2,
  Star,
  Search,
  MessageSquare,
  AlertTriangle,
  User,
  Package,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";

const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: "",
    productId: "",
  });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  const query: Record<string, any> = { page, limit };
  if (searchTerm) {
    if (searchTerm.length === 36 && searchTerm.includes("-")) {
      query.searchTerm = searchTerm;
    } else {
      query.searchTerm = searchTerm;
    }
  }

  const { data, isLoading, isError, refetch } = useGetAllReviewsQuery(query);
  const [createReview, { isLoading: createLoading }] =
    useCreateReviewMutation();
  const [updateReview, { isLoading: updateLoading }] =
    useUpdateReviewMutation();
  const [deleteReview, { isLoading: deleteLoading }] =
    useDeleteReviewMutation();

  const reviews: IReview[] = data?.data?.data || [];
  const meta = data?.data?.meta;

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

  const handleEditClick = (review: IReview) => {
    setEditingReview(review);
    setReviewData({
      rating: review.rating,
      comment: review.comment,
      productId: review.productId,
    });
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (
      !reviewData.rating ||
      !reviewData.comment.trim() ||
      !reviewData.productId.trim()
    ) {
      toast.error("Rating, Comment, and Product ID are required.");
      return;
    }

    if (!user?.id) {
      toast.error("User not authenticated. Cannot submit review.");
      return;
    }

    try {
      if (editingReview) {
        await updateReview({ id: editingReview.id, data: reviewData }).unwrap();
        toast.success("Review updated successfully!");
      } else {
        await createReview({ ...reviewData, userId: user.id }).unwrap();
        toast.success("Review added successfully!");
      }
      setIsFormDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save review.");
      console.error("Review save error:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteReview(itemToDelete).unwrap();
      toast.success("Review deleted successfully!");
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete review.");
      console.error("Review delete error:", error);
    }
  };

  // Calculate stats
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  const fiveStarReviews = reviews.filter(
    (review) => review.rating === 5
  ).length;

  if (isLoading) return <ReviewsSkeleton />;

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Failed to load reviews
            </h3>
            <p className="text-muted-foreground mb-4">
              Please try refreshing the page
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </motion.div>
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
        className="container mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              <Star className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500 bg-clip-text text-transparent">
                Product Reviews
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage customer feedback and ratings
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Reviews
                  </p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {meta?.total.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                      {averageRating}
                    </p>
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    5-Star Reviews
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {fiveStarReviews}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Star className="h-6 w-6 text-green-600 dark:text-green-400 fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Page
                  </p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {page}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {Math.ceil((meta?.total || 0) / (meta?.limit || 1))}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Controls */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by Product ID or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-primary" />
                <span>All Reviews</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Review ID</TableHead>
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Rating</TableHead>
                      <TableHead className="font-semibold">Comment</TableHead>
                      <TableHead className="text-right font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 rounded-full bg-muted">
                              <MessageSquare className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">
                                No reviews found
                              </h3>
                              <p className="text-muted-foreground">
                                {searchTerm
                                  ? "Try adjusting your search terms"
                                  : "No reviews have been submitted yet"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      reviews.map((review, index) => (
                        <motion.tr
                          key={review.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              {review.id.slice(0, 8)}...
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge
                                variant="secondary"
                                className="font-mono text-xs"
                              >
                                {review.productId.slice(0, 8)}...
                              </Badge>
                              <p className="text-sm font-medium max-w-xs truncate">
                                {review.product?.name || "N/A"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="p-1 rounded-full bg-muted">
                                <User className="h-3 w-3" />
                              </div>
                              <span className="text-sm">
                                {review.user?.name || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-500 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">
                                {review.rating}/5
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="max-w-xs truncate text-sm">
                              {review.comment}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2 ">
                              <Link href={`/products/${review.productId}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditClick(review)}
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteClick(review.id)}
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        <motion.div variants={itemVariants}>
          <PaginationControls
            currentPage={page}
            totalPages={Math.ceil((meta?.total || 0) / (meta?.limit || 1))}
            totalItems={meta?.total || 0}
            itemsPerPage={limit}
            limitOptions={[5, 10, 20, 50]}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </motion.div>
      </motion.div>

      {/* Edit Review Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Star className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl">
                {editingReview ? "Edit Review" : "Add New Review"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <Card className="border-dashed border-2">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="productId" className="text-sm font-medium">
                    Product ID
                  </Label>
                </div>
                <Input
                  id="productId"
                  value={reviewData.productId}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, productId: e.target.value })
                  }
                  placeholder="Enter Product ID"
                  disabled={!!editingReview}
                  className="border-2 focus:border-primary"
                />
              </CardContent>
            </Card>

            <Card className="border-dashed border-2">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="rating" className="text-sm font-medium">
                    Rating
                  </Label>
                </div>
                <div className="flex items-center space-x-4">
                  <Input
                    id="rating"
                    type="number"
                    value={reviewData.rating}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        rating: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter rating (1-5)"
                    min={1}
                    max={5}
                    className="border-2 focus:border-primary max-w-32"
                  />
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 cursor-pointer transition-colors ${
                          i < reviewData.rating
                            ? "text-yellow-500 fill-current"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                        onClick={() =>
                          setReviewData({ ...reviewData, rating: i + 1 })
                        }
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="comment" className="text-sm font-medium">
                    Comment
                  </Label>
                </div>
                <Textarea
                  id="comment"
                  value={reviewData.comment}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, comment: e.target.value })
                  }
                  placeholder="Enter your review comment..."
                  className="border-2 focus:border-primary min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsFormDialogOpen(false)}
              disabled={createLoading || updateLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={createLoading || updateLoading}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {createLoading || updateLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : editingReview ? (
                "Update Review"
              ) : (
                "Add Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            </div>
          </DialogHeader>

          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
          </div>

          <DialogFooter className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Loading skeleton component
const ReviewsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
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
          <CardHeader className="border-b">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
