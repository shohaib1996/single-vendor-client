"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useCreateProductSpecificationMutation,
  useUpdateProductSpecificationMutation,
  useDeleteProductSpecificationMutation,
  useGetProductSpecificationsQuery,
} from "@/redux/api/productSpecification/productSpecificationApi";
import { IProductSpecification } from "@/types";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Eye, Edit, Trash2, Plus, Search, Settings, Package, AlertTriangle, Loader2, X, ExternalLink } from 'lucide-react';
import Link from "next/link";

const SpecificationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingSpecification, setEditingSpecification] =
    useState<IProductSpecification | null>(null);
  const [specList, setSpecList] = useState<
    { productId: string; key: string; value: string }[]
  >([{ productId: "", key: "", value: "" }]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const query: Record<string, any> = { page, limit };
  if (searchTerm) {
    query.productId = searchTerm;
  }


  const { data, isLoading, isError, refetch } =
    useGetProductSpecificationsQuery(query);
  const [createSpecification, { isLoading: createLoading }] =
    useCreateProductSpecificationMutation();
  const [updateSpecification, { isLoading: updateLoading }] =
    useUpdateProductSpecificationMutation();
  const [deleteSpecification, { isLoading: deleteLoading }] =
    useDeleteProductSpecificationMutation();

  const specifications: IProductSpecification[] = data?.data?.data || [];
  const totalPages = Math.ceil(data?.data?.meta?.total / data?.data?.meta?.limit) || 1;
  const totalItems = data?.data?.meta?.total || 0;

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
    setEditingSpecification(null);
    setSpecList([{ productId: "", key: "", value: "" }]);
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (spec: IProductSpecification) => {
    setEditingSpecification(spec);
    setSpecList([
      { productId: spec.productId, key: spec.key, value: spec.value },
    ]);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleAddMore = () => {
    setSpecList([
      ...specList,
      { productId: specList[0].productId, key: "", value: "" },
    ]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecList(specList.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    index: number,
    field: keyof (typeof specList)[0],
    value: string
  ) => {
    const updatedSpecList = [...specList];
    updatedSpecList[index] = { ...updatedSpecList[index], [field]: value };
    setSpecList(updatedSpecList);
  };

const handleFormSubmit = async () => {
  // Validate all fields
  const isValid = specList.every(
    (spec) => spec.productId.trim() && spec.key.trim() && spec.value.trim()
  );
  if (!isValid) {
    toast.error("All fields are required for each specification.");
    return;
  }

  try {
    if (editingSpecification) {
      // For editing, only handle the first specification
      await updateSpecification({
        id: editingSpecification.id,
        data: specList[0], // Update still uses single object
      }).unwrap();
      toast.success("Specification updated successfully!");
    } else {
      // For creation, always send array of specifications
      await createSpecification(specList).unwrap();
      toast.success(
        `Specification${specList.length > 1 ? "s" : ""} added successfully!`
      );
    }
    setIsFormDialogOpen(false);
    refetch();
  } catch (error: any) {
    toast.error(error?.data?.message || "Failed to save specification(s).");
    console.error("Specification save error:", error);
  }
};

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteSpecification(itemToDelete).unwrap();
      toast.success("Specification deleted successfully!");
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete specification.");
      console.error("Specification delete error:", error);
    }
  };

  if (isLoading) return <SpecificationSkeleton />;
  
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load specifications</h3>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-2 md:p-6 lg:p-4">
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
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Product Specifications
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage detailed specifications for your products to help customers make informed decisions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Specifications</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Page</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{page} of {totalPages}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Per Page</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{limit} items</p>
                </div>
                <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-0 py-0">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by Product ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-muted/50 focus:bg-background transition-colors w-full"
                  />
                </div>
                <Button 
                  onClick={handleAddClick}
                  className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-0 overflow-hidden py-0">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center space-x-2 pt-2">
                <Package className="h-5 w-5 text-primary" />
                <span>Specifications List</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Product ID</TableHead>
                      <TableHead className="font-semibold">Key</TableHead>
                      <TableHead className="font-semibold">Value</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {specifications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <Package className="h-12 w-12 text-muted-foreground/50" />
                            <div>
                              <p className="text-lg font-medium text-muted-foreground">No specifications found</p>
                              <p className="text-sm text-muted-foreground/70">Create your first specification to get started</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      specifications.map((spec, index) => (
                        <motion.tr
                          key={spec.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-muted/30 transition-colors group"
                        >
                          <TableCell className="font-medium">
                            <Badge variant="outline" className="font-mono">
                              {spec.id}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="font-mono">
                              {spec.productId}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-foreground">
                              {spec.key}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {spec.value}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link href={`/products/${spec.productId}`}>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className=" dark:hover:bg-blue-950/20"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditClick(spec)}
                                className=" dark:hover:bg-green-950/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteClick(spec.id)}
                                className="hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-950/20 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
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
            totalItems={totalItems}
            itemsPerPage={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </motion.div>

        {/* Form Dialog */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="flex items-center space-x-2 text-xl">
                <Settings className="h-6 w-6 text-primary" />
                <span>
                  {editingSpecification
                    ? "Edit Specification"
                    : "Add New Specification"}
                </span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {specList.map((spec, index) => (
                <Card key={index} className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 space-y-4">
                    {index > 0 && (
                      <div className="flex items-center justify-between border-b pb-4">
                        <h4 className="font-medium text-muted-foreground">Specification #{index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSpec(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`productId-${index}`} className="text-sm font-medium">
                          Product ID *
                        </Label>
                        <Input
                          id={`productId-${index}`}
                          value={spec.productId}
                          onChange={(e) =>
                            handleInputChange(index, "productId", e.target.value)
                          }
                          placeholder="Enter Product ID"
                          disabled={!!editingSpecification || index > 0}
                          className="font-mono"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`key-${index}`} className="text-sm font-medium">
                          Specification Key *
                        </Label>
                        <Input
                          id={`key-${index}`}
                          value={spec.key}
                          onChange={(e) =>
                            handleInputChange(index, "key", e.target.value)
                          }
                          placeholder="e.g., Color, Material, Size"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`value-${index}`} className="text-sm font-medium">
                          Specification Value *
                        </Label>
                        <Input
                          id={`value-${index}`}
                          value={spec.value}
                          onChange={(e) =>
                            handleInputChange(index, "value", e.target.value)
                          }
                          placeholder="e.g., Red, Cotton, Large"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!editingSpecification && (
                <Button
                  variant="outline"
                  onClick={handleAddMore}
                  className="w-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Specification
                </Button>
              )}
            </div>
            
            <DialogFooter className="border-t pt-4">
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
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {(createLoading || updateLoading) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingSpecification
                  ? "Update Specification"
                  : `Add Specification${specList.length > 1 ? "s" : ""}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            </DialogHeader>
            
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete this specification? This action cannot be undone and will permanently remove the specification data.
              </p>
            </div>
            
            <DialogFooter className="sm:flex-row-reverse gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Delete Specification
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const SpecificationSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
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
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-40" />
            </div>
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
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-40" />
                  <div className="flex space-x-2 ml-auto">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
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

export default SpecificationPage;
