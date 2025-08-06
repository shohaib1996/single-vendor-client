"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/redux/api/brand/brandApi";
import { useGetAllCategoriesQuery } from "@/redux/api/category/categoryApi";
import { IBrand } from "@/types/product/product";
import { ICategory } from "@/types/category/category";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useDebounced } from "@/redux/hooks/hooks";
import { PaginationControls } from "@/components/common/PaginationControls";
import { CopyButton } from "@/components/common/CopyButton";
import { Tag, Plus, Edit, Trash2, AlertTriangle, Search, Package, BarChart3, FileText, X } from 'lucide-react';

const BrandPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IBrand | null>(null);
  const [brandData, setBrandData] = useState({
    name: "",
    categoryIds: [] as string[],
  });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounced({ searchQuery: searchTerm, delay: 600 });

  const query: Record<string, any> = { page, limit };
  if (debouncedSearchTerm) {
    query.searchTerm = debouncedSearchTerm;
  }

  const { data: brandResponse, isLoading, isError, refetch } = useGetAllBrandsQuery(query);
  const { data: categoryResponse } = useGetAllCategoriesQuery({});
  const [createBrand, { isLoading: createLoading }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: updateLoading }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: deleteLoading }] = useDeleteBrandMutation();

  const brands: IBrand[] = brandResponse?.data || [];
  const categories: ICategory[] = categoryResponse?.data || [];
  const totalPages = Math.ceil(brandResponse?.meta?.total / brandResponse?.meta?.limit) || 1;

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

  const handleAddClick = () => {
    setEditingBrand(null);
    setBrandData({ name: "", categoryIds: [] });
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (brand: IBrand) => {
    setEditingBrand(brand);
    setBrandData({
      name: brand.name,
      categoryIds: brand.categories.map((cat) => cat.id),
    });
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!brandData.name.trim() || brandData.categoryIds.length === 0) {
      toast.error("Name and at least one category are required.");
      return;
    }

    try {
      if (editingBrand) {
        await updateBrand({
          id: editingBrand.id,
          data: brandData,
        }).unwrap();
        toast.success("Brand updated successfully!");
      } else {
        await createBrand(brandData).unwrap();
        toast.success("Brand added successfully!");
      }
      setIsFormDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save brand.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteBrand(itemToDelete).unwrap();
      toast.success("Brand deleted successfully!");
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete brand.");
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const selectedIds = brandData.categoryIds.includes(categoryId)
      ? brandData.categoryIds.filter((id) => id !== categoryId)
      : [...brandData.categoryIds, categoryId];
    setBrandData({ ...brandData, categoryIds: selectedIds });
  };

  const removeCategoryFromBrand = (categoryId: string) => {
    setBrandData({
      ...brandData,
      categoryIds: brandData.categoryIds.filter((id) => id !== categoryId)
    });
  };

  if (isLoading) return <BrandSkeleton />;
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load brands</h3>
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
        className="container mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Brand Management
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage your product brands and their category associations
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 py-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Brands</p>
                  <p className="text-2xl font-bold text-foreground">
                    {brandResponse?.meta?.total || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-950/20">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 py-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Page</p>
                  <p className="text-2xl font-bold text-foreground">{page}</p>
                </div>
                <div className="p-3 rounded-full bg-green-50 dark:bg-green-950/20">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 py-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Items Per Page</p>
                  <p className="text-2xl font-bold text-foreground">{limit}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-950/20">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg py-0">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search brands..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleAddClick} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Brand</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardContent className="p-0 py-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Categories</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brands.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 rounded-full bg-muted">
                              <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">No brands found</h3>
                              <p className="text-muted-foreground">
                                {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first brand"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      brands.map((brand, index) => (
                        <motion.tr
                          key={brand.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {brand.id}
                              </Badge>
                              <CopyButton text={brand.id} />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{brand.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {brand.categories.map((cat) => (
                                <Badge key={cat.id} variant="secondary" className="text-xs">
                                  {cat.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditClick(brand)}
                                className="flex items-center space-x-1"
                              >
                                <Edit className="h-3 w-3" />
                                <span>Edit</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteClick(brand.id)}
                                className="flex items-center space-x-1"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete</span>
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
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={limit}
            onLimitChange={setLimit}
            limitOptions={[5, 10, 15, 20, 30]}
            totalItems={brandResponse?.meta?.total || 0}
          />
        </motion.div>

        {/* Form Dialog */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-primary" />
                <span>{editingBrand ? "Edit Brand" : "Add New Brand"}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Brand Name Section */}
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Brand Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-0">
                  <div className="space-y-2">
                    <Label htmlFor="name">Brand Name *</Label>
                    <Input
                      id="name"
                      value={brandData.name}
                      onChange={(e) => setBrandData({ ...brandData, name: e.target.value })}
                      placeholder="Enter brand name"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories Section */}
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Category Selection</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 py-0">
                  <div className="space-y-2">
                    <Label>Available Categories</Label>
                    <Select onValueChange={handleCategoryToggle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select categories to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .filter(cat => !brandData.categoryIds.includes(cat.id))
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {brandData.categoryIds.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Categories ({brandData.categoryIds.length})</Label>
                      <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                        {brandData.categoryIds.map((id) => {
                          const category = categories.find((cat) => cat.id === id);
                          return (
                            <Badge
                              key={id}
                              variant="secondary"
                              className="flex items-center space-x-1 pr-1"
                            >
                              <span>{category?.name}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeCategoryFromBrand(id)}
                                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleFormSubmit} 
                disabled={createLoading || updateLoading}
                className="flex items-center space-x-2"
              >
                {(createLoading || updateLoading) && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                <span>{createLoading || updateLoading ? "Saving..." : "Save Brand"}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Confirm Deletion</span>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete this brand? This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConfirm} 
                disabled={deleteLoading}
                className="flex items-center space-x-2"
              >
                {deleteLoading && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                <span>{deleteLoading ? "Deleting..." : "Delete Brand"}</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const BrandSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="container mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6 py-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="p-6 py-0">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="p-0 py-0">
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-40" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandPage;
