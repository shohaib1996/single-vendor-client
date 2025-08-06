"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductForm from "@/components/pages/ProductManagement/ProductForm";
import {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/redux/api/product/productApi";
import { toast } from "sonner";
import { IProduct, ICategory, IBrand } from "@/types";
import { useGetAllCategoriesQuery } from "@/redux/api/category/categoryApi";
import { useGetAllBrandsQuery } from "@/redux/api/brand/brandApi";
import { PaginationControls } from "@/components/common/PaginationControls";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  Star,
  AlertCircle,
  Eye,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
import Link from "next/link";

const AllProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const query: any = {
    page: String(page),
    limit: String(limit),
  };

  if (searchTerm) {
    query.searchTerm = searchTerm;
  }

  const { data, isLoading, isError, refetch } = useGetAllProductsQuery(query);
  const { data: categoriesData } = useGetAllCategoriesQuery({});
  const { data: brandsData } = useGetAllBrandsQuery({});

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data || [];
  const meta = data?.meta;

  const categories: ICategory[] = categoriesData?.data || [];
  const brands: IBrand[] = brandsData?.data || [];

  const getCategoryName = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.name : "N/A";
  };

  const getBrandName = (id: string) => {
    const brand = brands.find((b) => b.id === id);
    return brand ? brand.name : "N/A";
  };

  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const handleAddProduct = async (newProductData: any) => {
    try {
      await createProduct(newProductData).unwrap();
      toast.success("Product created successfully!");
      setIsAddProductDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create product.");
    }
  };

  const handleUpdateProduct = async (updatedProductData: any) => {
    try {
      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          data: updatedProductData,
        }).unwrap();
        toast.success("Product updated successfully!");
        setIsEditProductDialogOpen(false);
        setEditingProduct(null);
        refetch();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update product.");
    }
  };

  const handleEdit = (id: string) => {
    const productToEdit = products.find(
      (product: IProduct) => product.id === id
    );
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsEditProductDialogOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete product.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  };

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
    return <ProductsPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Failed to load products
          </h3>
          <p className="text-muted-foreground">
            Please try refreshing the page
          </p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto space-y-6 "
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    <Package className="h-8 w-8 text-primary" />
                    Product Management
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Manage your product catalog with ease
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Dialog
                    open={isAddProductDialogOpen}
                    onOpenChange={setIsAddProductDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="gap-2 shadow-lg">
                        <Plus className="h-4 w-4" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                          <Plus className="h-5 w-5" />
                          Add New Product
                        </DialogTitle>
                      </DialogHeader>
                      <ProductForm
                        onSubmit={handleAddProduct}
                        onCancel={() => setIsAddProductDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-md p-0">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name, category, or brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Table */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg py-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Product</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Brand</TableHead>
                      <TableHead className="font-semibold">Price</TableHead>
                      <TableHead className="font-semibold">Stock</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Package className="h-12 w-12 text-muted-foreground" />
                            <p className="text-lg font-medium">
                              No products found
                            </p>
                            <p className="text-muted-foreground">
                              {searchTerm
                                ? "Try adjusting your search terms"
                                : "Get started by adding your first product"}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product: IProduct) => (
                        <TableRow
                          key={product.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img
                                    src={
                                      product.images[0] || "/placeholder.svg"
                                    }
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {getCategoryName(product.categoryId || "")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {getBrandName(product.brandId || "")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-semibold">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.isDiscountActive &&
                                product.discountPercentage && (
                                  <span className="text-xs text-green-600 dark:text-green-400">
                                    {product.discountPercentage}% off
                                  </span>
                                )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock > 10
                                  ? "default"
                                  : product.stock > 0
                                  ? "secondary"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {product.featured && (
                                <Badge
                                  variant="default"
                                  className="text-xs gap-1"
                                >
                                  <Star className="h-3 w-3" />
                                  Featured
                                </Badge>
                              )}
                              <Badge
                                variant={
                                  product.stock > 0 ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {product.stock > 0 ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/products/${product.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(product.id)}
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Product
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "
                                      {product.name}"? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pagination */}
        {products.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="shadow-md py-0">
              <CardContent className="p-4">
                <PaginationControls
                  currentPage={page}
                  totalPages={Math.ceil(
                    (meta?.total || 0) / (meta?.limit || 1)
                  )}
                  totalItems={meta?.total || 0}
                  itemsPerPage={limit}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                  limitOptions={[5, 10, 20, 50]}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog
            open={isEditProductDialogOpen}
            onOpenChange={setIsEditProductDialogOpen}
          >
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Product
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                initialData={editingProduct}
                onSubmit={handleUpdateProduct}
                onCancel={() => setIsEditProductDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </div>
  );
};

// Loading skeleton component
const ProductsPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header Skeleton */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search Skeleton */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
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
                    <TableHead>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                    <TableHead>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-12 w-12 rounded-lg" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Skeleton */}
        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-64" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AllProductsPage;
