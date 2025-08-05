"use client"

import React, { useState } from 'react';
import {
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation
} from '@/redux/api/review/reviewApi';
import { IReview } from '@/types/product/product';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PaginationControls } from '@/components/common/PaginationControls';
import { useAppSelector } from '@/redux/hooks/hooks';

const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '', productId: '' });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { user } = useAppSelector((state) => state.auth);

  const query: Record<string, any> = { page, limit };
  if (searchTerm) {
    // Assuming backend supports searching by productId or productName via a single 'searchTerm' param
    // You might need to adjust this based on your actual API implementation
    if (searchTerm.length === 36 && searchTerm.includes('-')) { // Basic check for UUID format
      query.searchTerm = searchTerm;
    } else {
      query.searchTerm = searchTerm;
    }
  }

  const { data, isLoading, isError, refetch } = useGetAllReviewsQuery(query);
  const [createReview, { isLoading: createLoading }] = useCreateReviewMutation();
  const [updateReview, { isLoading: updateLoading }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: deleteLoading }] = useDeleteReviewMutation();

  const reviews: IReview[] = data?.data?.data || [];
  const totalPages = data?.data?.meta?.totalPages || 1;
  const totalItems = data?.data?.meta?.total || 0;

//   const handleAddClick = () => {
//     setEditingReview(null);
//     setReviewData({ rating: 0, comment: '', productId: '' });
//     setIsFormDialogOpen(true);
//   };

  const handleEditClick = (review: IReview) => {
    setEditingReview(review);
    setReviewData({ rating: review.rating, comment: review.comment, productId: review.productId });
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!reviewData.rating || !reviewData.comment.trim() || !reviewData.productId.trim()) {
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

  if (isLoading) return <div className="p-4">Loading reviews...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading reviews.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Reviews</h1>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by Product ID or Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {/* <Button onClick={handleAddClick}>Add Review</Button> */}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No reviews found.</TableCell>
            </TableRow>
          ) : (
            reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.id}</TableCell>
                <TableCell>{review.productId}</TableCell>
                <TableCell>{review.product?.name || 'N/A'}</TableCell>
                <TableCell>{review.user?.name || 'N/A'}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" onClick={() => handleEditClick(review)} className="mr-2">
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(review.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingReview ? "Edit Review" : "Add New Review"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right">
                Product ID
              </Label>
              <Input
                id="productId"
                value={reviewData.productId}
                onChange={(e) => setReviewData({ ...reviewData, productId: e.target.value })}
                className="col-span-3"
                placeholder="Enter Product ID"
                disabled={!!editingReview} // Disable product ID edit for existing reviews
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                type="number"
                value={reviewData.rating}
                onChange={(e) => setReviewData({ ...reviewData, rating: parseInt(e.target.value) || 0 })}
                className="col-span-3"
                placeholder="Enter rating (1-5)"
                min={1}
                max={5}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Comment
              </Label>
              <Textarea
                id="comment"
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                className="col-span-3"
                placeholder="Enter your comment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleFormSubmit} disabled={createLoading || updateLoading}>
              {createLoading || updateLoading ? 'Saving...' : (editingReview ? "Update Review" : "Add Review")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this review? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsPage;