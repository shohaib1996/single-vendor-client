"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/redux/api/category/categoryApi";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { CopyButton } from "@/components/common/CopyButton";
import { PaginationControls } from "@/components/common/PaginationControls";

import Image from "next/image";
import { uploadFiles } from "@/lib/uploadFile";
import Link from "next/link";
import {
  Tags,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  ImageIcon,
  FileText,
  Hash,
  LinkIcon,
} from "lucide-react";

const CategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [categoryData, setCategoryData] = useState({
    name: "",
    slug: "",
    icon: "",
    description: "",
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const query: Record<string, any> = { page, limit };
  if (searchTerm) {
    query.searchTerm = searchTerm;
  }
  query.parentId = null;

  const { data, isLoading, isError, refetch } = useGetAllCategoriesQuery(query);
  const [createCategory, { isLoading: createLoading }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: updateLoading }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleteLoading }] =
    useDeleteCategoryMutation();

  const categories: ICategory[] = data?.data || [];

  const totalPages = Math.ceil(data?.meta?.total / data?.meta?.limit) || 1;
  const totalItems = data?.meta?.total || 0;

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
    setEditingCategory(null);
    setCategoryData({ name: "", slug: "", icon: "", description: "" });
    setIconFile(null);
    setIsFormDialogOpen(true);
  };

  const handleEditClick = (category: ICategory) => {
    setEditingCategory(category);
    setCategoryData({
      name: category.name,
      slug: category.slug,
      icon: category.icon ?? "",
      description: category.description ?? "",
    });
    setIconFile(null);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async () => {
    if (
      !categoryData.name.trim() ||
      !categoryData.slug.trim() ||
      !categoryData.description.trim()
    ) {
      toast.error("Name, Slug, and Description are required.");
      return;
    }

    let iconUrl = categoryData.icon;
    if (iconFile) {
      try {
        const uploadedUrls = await uploadFiles([iconFile]);
        if (uploadedUrls && uploadedUrls.length > 0) {
          iconUrl = uploadedUrls[0];
          toast.success("Icon uploaded successfully!");
          setCategoryData((prev) => ({ ...prev, icon: iconUrl }));
        } else {
          toast.error("Failed to upload icon.");
          return;
        }
      } catch (error) {
        toast.error("Error uploading icon.");
        console.error("Upload error:", error);
        return;
      }
    } else if (!iconUrl.trim()) {
      toast.error("Icon URL or file is required.");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: { ...categoryData, icon: iconUrl },
        }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await createCategory({ ...categoryData, icon: iconUrl }).unwrap();
        toast.success("Category added successfully!");
      }
      setIsFormDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save category.");
      console.error("Category save error:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await deleteCategory(itemToDelete).unwrap();
      toast.success("Category deleted successfully!");
      refetch();
      setIsConfirmDialogOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category.");
      console.error("Category delete error:", error);
    }
  };

  if (isLoading) return <CategorySkeleton />;
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Failed to load categories
          </h3>
          <p className="text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );

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
              <Tags className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Category Management
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Organize your products with categories and subcategories
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
        >
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Categories
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {categories?.length}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-950/20">
                  <Tags className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Current Page
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {page} of {totalPages}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-50 dark:bg-green-950/20">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Items Per Page
                  </p>
                  <p className="text-2xl font-bold text-foreground">{categories?.length}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-950/20">
                  <Hash className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg py-0">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4">
                {/* <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div> */}
                <Button
                  onClick={handleAddClick}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 "
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Slug</TableHead>
                      <TableHead className="font-semibold">Icon</TableHead>
                      <TableHead className="font-semibold">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold">
                        Subcategories
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center space-y-4">
                            <div className="p-4 rounded-full bg-muted">
                              <Tags className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-semibold">
                                No categories found
                              </h3>
                              <p className="text-muted-foreground">
                                Get started by creating your first category
                              </p>
                            </div>
                            <Button onClick={handleAddClick} variant="outline">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Category
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category, index) => (
                        <motion.tr
                          key={category.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-muted/30 transition-colors duration-200"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                {category.id.slice(0, 15)}...
                              </span>
                              <CopyButton text={category.id} />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                              {category.slug}
                            </span>
                          </TableCell>
                          <TableCell>
                            {category.icon && (
                              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted overflow-hidden">
                                <Image
                                  src={category.icon || "/placeholder.svg"}
                                  alt={category.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p
                              className="truncate max-w-[130px]"
                              title={category.description ?? undefined}
                            >
                              {category.description}
                            </p>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/admin/category-brand/category/${category.id}`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View ({category?.children.length})
                              </Button>
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditClick(category)}
                                className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950/20 dark:hover:text-blue-400 transition-colors"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteClick(category.id)}
                                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Delete
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
        {totalItems > 0 && (
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
        )}

        {/* Form Dialog */}
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-xl">
                <Tags className="h-5 w-5 text-primary" />
                <span>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Category Name *</Label>
                      <Input
                        id="name"
                        value={categoryData.name}
                        onChange={(e) =>
                          setCategoryData({
                            ...categoryData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter category name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={categoryData.slug}
                        onChange={(e) =>
                          setCategoryData({
                            ...categoryData,
                            slug: e.target.value,
                          })
                        }
                        placeholder="category-slug"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={categoryData.description}
                      onChange={(e) =>
                        setCategoryData({
                          ...categoryData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter category description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Icon Section */}
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Category Icon</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="iconUrl">Icon URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="iconUrl"
                        value={categoryData.icon}
                        onChange={(e) =>
                          setCategoryData({
                            ...categoryData,
                            icon: e.target.value,
                          })
                        }
                        placeholder="Enter icon URL or upload file below"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(categoryData.icon, "_blank")}
                        disabled={!categoryData.icon}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="iconFile">Or Upload Icon File</Label>
                    <Input
                      id="iconFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setIconFile(e.target.files ? e.target.files[0] : null)
                      }
                    />
                  </div>
                  {categoryData.icon && !iconFile && (
                    <div className="flex justify-center p-4 bg-muted rounded-lg">
                      <Image
                        src={categoryData.icon || "/placeholder.svg"}
                        alt="Category Icon Preview"
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFormDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleFormSubmit}
                disabled={createLoading || updateLoading}
                className="bg-gradient-to-r from-primary to-primary/80"
              >
                {createLoading || updateLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>
                    {editingCategory ? "Update Category" : "Add Category"}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Confirm Deletion</span>
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete this category? This action
                cannot be undone and may affect related products.
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
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
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  "Delete Category"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const CategorySkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
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
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Table Skeleton */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <TableHead key={index}>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 7 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
